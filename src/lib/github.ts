/**
 * Lightweight GitHub REST API client (no Octokit dependency).
 *
 * Uses raw `fetch` to read repository metadata, README, dependency manifests and
 * the file tree of a public or private (token-authorized) repository.
 *
 * Auth: when GITHUB_TOKEN is set in the environment, requests are authenticated
 * (5000 req/h and access to private repos owned by the token's user). Without a
 * token, requests are anonymous (60 req/h, public repos only).
 */

const GITHUB_API = 'https://api.github.com';

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export interface RepoContext {
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  stars: number;
  language: string | null;
  topics: string[];
  defaultBranch: string;
  url: string;
  homepage: string | null;
}

export interface RepoAnalysisInput {
  repo: RepoContext;
  readme: string | null;
  /** Best-effort dependency / project manifest content (package.json, etc). */
  manifest: { filename: string; content: string } | null;
  /** Flattened file paths, capped and summarized. */
  tree: string[];
}

/** Error thrown when the GitHub API returns 404 / 403 / rate-limited. */
export class GitHubError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'GitHubError';
  }
}

async function ghFetch(path: string): Promise<any> {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: authHeaders() });
  if (res.status === 404) {
    throw new GitHubError(404, 'Repositório não encontrado ou é privado.');
  }
  if (res.status === 403) {
    throw new GitHubError(
      403,
      'Limite de requisições ao GitHub atingido ou acesso negado (repositório privado).'
    );
  }
  if (!res.ok) {
    throw new GitHubError(res.status, `GitHub API erro (${res.status}).`);
  }
  return res.json();
}

/** Extracts `owner/repo` from a GitHub URL. Returns null if invalid. */
export function parseRepoUrl(raw: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    if (!/github\.com$/i.test(url.hostname) && url.hostname !== 'github.com') return null;
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') };
  } catch {
    // Not a parseable URL — try the "owner/repo" shorthand.
    const m = raw.trim().match(/^([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/);
    if (m) return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
    return null;
  }
}

export async function fetchRepoContext(owner: string, repo: string): Promise<RepoContext> {
  const data = await ghFetch(`/repos/${owner}/${repo}`);
  return {
    name: data.name,
    fullName: data.full_name,
    owner: data.owner?.login ?? owner,
    description: data.description,
    stars: data.stargazers_count ?? 0,
    language: data.language,
    topics: Array.isArray(data.topics) ? data.topics : [],
    defaultBranch: data.default_branch ?? 'main',
    url: data.html_url,
    homepage: data.homepage,
  };
}

/** Fetches and decodes the README (any extension) as plain text. */
export async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/readme`);
    if (!data.content) return null;
    const text = Buffer.from(data.content, 'base64').toString('utf-8');
    // Cap README to ~6000 chars to keep prompts manageable.
    return text.length > 6000 ? `${text.slice(0, 6000)}\n\n...[README truncado]` : text;
  } catch (err) {
    if (err instanceof GitHubError && err.status === 404) return null;
    throw err;
  }
}

const MANIFEST_FILES = [
  'package.json',
  'requirements.txt',
  'pyproject.toml',
  'go.mod',
  'pom.xml',
  'build.gradle',
  'Cargo.toml',
  'composer.json',
  'Gemfile',
];

/** Fetches the first available dependency manifest in the repo root. */
export async function fetchManifest(
  owner: string,
  repo: string,
  branch: string
): Promise<{ filename: string; content: string } | null> {
  for (const filename of MANIFEST_FILES) {
    try {
      const res = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/contents/${filename}?ref=${branch}`,
        { headers: authHeaders() }
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.content) {
        let content = Buffer.from(data.content, 'base64').toString('utf-8');
        if (content.length > 4000) content = `${content.slice(0, 4000)}\n...[truncado]`;
        return { filename, content };
      }
    } catch {
      // try next manifest
    }
  }
  return null;
}

/**
 * Fetches the repository file tree (recursive) and returns a summarized list.
 * Filters out noise (node_modules, .git, dist, build) and caps the result.
 */
export async function fetchRepoTree(
  owner: string,
  repo: string,
  branch: string
): Promise<string[]> {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    if (!Array.isArray(data.tree)) return [];
    const IGNORE = /^(node_modules|\.git|dist|build|\.next|vendor|target|coverage|\.cache)\//;
    return data.tree
      .filter((entry: any) => entry.type === 'blob' && !IGNORE.test(entry.path))
      .slice(0, 120)
      .map((entry: any) => entry.path as string);
  } catch (err) {
    if (err instanceof GitHubError && err.status === 404) return [];
    throw err;
  }
}

/** Orchestrates all the fetches needed to build an AI analysis prompt. */
export async function gatherRepoAnalysisInput(
  owner: string,
  repo: string
): Promise<RepoAnalysisInput> {
  const repoCtx = await fetchRepoContext(owner, repo);
  const [readme, manifest, tree] = await Promise.all([
    fetchReadme(owner, repo),
    fetchManifest(owner, repo, repoCtx.defaultBranch),
    fetchRepoTree(owner, repo, repoCtx.defaultBranch),
  ]);
  return { repo: repoCtx, readme, manifest, tree };
}
