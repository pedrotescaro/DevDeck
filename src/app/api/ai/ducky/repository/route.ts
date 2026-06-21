import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { generateChatAI } from '@/lib/ai';
import { gatherRepoAnalysisInput, parseRepoUrl, GitHubError, type RepoContext } from '@/lib/github';
import { z } from 'zod';

const repoSchema = z.object({
  url: z.string().min(1),
  language: z.string().default(''),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model', 'assistant', 'ducky']),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

function buildRepoContextBlock(input: {
  repo: RepoContext;
  readme: string | null;
  manifest: { filename: string; content: string } | null;
  tree: string[];
}): string {
  const { repo, readme, manifest, tree } = input;
  const lines: string[] = [];
  lines.push(`# Contexto do repositório "${repo.fullName}"`);
  lines.push(`- URL: ${repo.url}`);
  if (repo.description) lines.push(`- Descrição: ${repo.description}`);
  lines.push(`- Linguagem principal: ${repo.language ?? 'não definida'}`);
  lines.push(`- Estrelas: ${repo.stars}`);
  if (repo.topics.length) lines.push(`- Tópicos: ${repo.topics.join(', ')}`);
  lines.push(`- Branch padrão: ${repo.defaultBranch}`);

  if (tree.length) {
    lines.push('\n## Estrutura de arquivos (resumo)');
    lines.push(tree.map((p) => `- ${p}`).join('\n'));
  }

  if (manifest) {
    lines.push(`\n## ${manifest.filename}`);
    lines.push('```');
    lines.push(manifest.content);
    lines.push('```');
  }

  if (readme) {
    lines.push('\n## README');
    lines.push(readme);
  }

  return lines.join('\n');
}

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const { url, language, history } = repoSchema.parse(body);

  const parsed = parseRepoUrl(url);
  if (!parsed) {
    return NextResponse.json(
      {
        text: 'Quack... Essa URL não parece ser de um repositório do GitHub. Tente algo como `github.com/usuario/repositorio`.',
      },
      { status: 400 }
    );
  }

  // 1. Buscar contexto do repositório na API do GitHub.
  let input;
  try {
    input = await gatherRepoAnalysisInput(parsed.owner, parsed.repo);
  } catch (err) {
    if (err instanceof GitHubError) {
      return NextResponse.json(
        { text: `Quack... ${err.message}` },
        { status: err.status === 404 ? 404 : 502 }
      );
    }
    throw err;
  }

  const repoBlock = buildRepoContextBlock(input);
  const { repo } = input;

  // 2. System prompt do Ducky atuando como analista de repositórios.
  const systemPrompt = `Você é o Ducky (quack! 🦆), o patinho de borracha de programação oficial do DevDeck, agora atuando como analista de repositórios do GitHub.
Analise o repositório fornecido pelo usuário e produza insights técnicos claros e acionáveis.

Diretrizes:
1. Use um tom alegre, inteligente e técnico em português do Brasil, com pequenas menções a patos.
2. Formate sempre em Markdown limpo, com syntax highlighting em blocos de código.
3. Baseie-se SOMENTE no contexto fornecido (README, estrutura de arquivos, manifesto de dependências). Não invente arquivos ou funcionalidades que não estejam evidentes.
${language ? `4. Quando relevante, adapte comentários à trilha ativa do usuário: **${language}**.` : ''}
5. Nunca saia do personagem. Você é o Ducky, não um modelo da OpenAI, Google ou Groq.`;

  // 3. Montar histórico + pergunta.
  const isFollowUp = history.some((h) => h.content && h.content.trim().length > 0);

  const messages: { role: 'user' | 'assistant'; content: string }[] = [];

  if (isFollowUp) {
    // Follow-up: injeta o contexto do repo como primeira mensagem do usuário
    // e preserva o histórico de conversa existente.
    messages.push({
      role: 'user',
      content: `Aqui está o contexto completo do repositório que estou analisando:\n\n${repoBlock}\n\nUse estas informações para responder às próximas perguntas.`,
    });
    messages.push({
      role: 'assistant',
      content: 'Quack! 🦆 Recebi o contexto do repositório e estou pronto. Pode perguntar!',
    });
    for (const h of history) {
      if (!h.content || !h.content.trim()) continue;
      messages.push({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.content,
      });
    }
  } else {
    // Primeira análise: pede um resumo automático.
    messages.push({
      role: 'user',
      content: `Analise o seguinte repositório do GitHub e gere um resumo técnico em Markdown:

${repoBlock}

Estruture sua resposta assim:
1. **Visão geral** — o que o projeto faz (2-3 frases).
2. **Stack tecnológica** — linguagens, frameworks e bibliotecas principais (detecte pelo manifesto e pela estrutura).
3. **Estrutura do projeto** — como os diretórios estão organizados e o papel das pastas principais.
4. **Pontos de destaque** — boas práticas ou decisões de arquitetologia interessantes.
5. **Sugestões** — melhorias ou próximos passos que você recomendaria.

Seja conciso e específico. Se faltar informação (ex: sem README), diga o que dá para inferir pela estrutura.`,
    });
  }

  const responseText = await generateChatAI(systemPrompt, messages);

  if (!responseText) {
    return NextResponse.json({
      text: 'Quack... Não consegui processar a análise do repositório agora. Pode tentar de novo?',
      repo: {
        name: repo.name,
        owner: repo.owner,
        language: repo.language,
        stars: repo.stars,
        url: repo.url,
      },
    });
  }

  return NextResponse.json({
    text: responseText,
    repo: {
      name: repo.name,
      owner: repo.owner,
      language: repo.language,
      stars: repo.stars,
      url: repo.url,
    },
  });
});
