'use client';

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import {
  Paperclip,
  History,
  Sparkles,
  Maximize2,
  ArrowLeft,
  Terminal,
  ShieldAlert,
  Zap,
  Lock,
  Unlock,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

// Custom SVG icon components since they are not exported by the installed lucide-react version
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FileCode = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m10 13-2 2 2 2" />
    <path d="m14 17 2-2-2-2" />
  </svg>
);

const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const ExternalLink = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const Copy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const RotateCw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <polyline points="21 3 21 8 16 8" />
  </svg>
);

const ThumbsUp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3l3.15-6.3a2.12 2.12 0 0 1 4.05 1.18V5.88z" />
  </svg>
);

const ThumbsDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-3.15 6.3a2.12 2.12 0 0 1-4.05-1.18V18.12z" />
  </svg>
);

const Share2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const Pencil = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

interface DuckyContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
    streak?: number;
    streak_days?: number;
  };
  activeLanguage: string;
}

/** A single piece of multimodal content (text or image) sent to the AI. */
type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image'; mimeType: string; data: string };

/** File picked by the user, before being converted to ContentParts on send. */
interface AttachedFile {
  id: string;
  name: string;
  kind: 'image' | 'code';
  /** For images: raw base64 (no prefix). For code: the file text. */
  data: string;
  mimeType?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ducky';
  text: string;
  isStreaming?: boolean;
  /** Multimodal parts attached to a user message (images + code). */
  attachments?: { name: string; kind: 'image' | 'code' }[];
  /** Metadata when this message is a repository-analysis result. */
  repo?: { name: string; owner: string; url: string; language: string | null };
}

/** Extensions accepted as code/text attachments. */
const CODE_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.py',
  '.java',
  '.go',
  '.rs',
  '.rb',
  '.php',
  '.c',
  '.cpp',
  '.cs',
  '.swift',
  '.kt',
  '.json',
  '.md',
  '.txt',
  '.css',
  '.scss',
  '.html',
  '.xml',
  '.yml',
  '.yaml',
  '.toml',
  '.ini',
  '.sh',
  '.sql',
  '.vue',
  '.svelte',
  '.dart',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_ATTACHMENTS = 4;

function fileExtension(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

function detectLanguageFromExtension(ext: string): string {
  const map: Record<string, string> = {
    '.js': 'javascript',
    '.jsx': 'jsx',
    '.ts': 'typescript',
    '.tsx': 'tsx',
    '.py': 'python',
    '.java': 'java',
    '.go': 'go',
    '.rs': 'rust',
    '.rb': 'ruby',
    '.php': 'php',
    '.c': 'c',
    '.cpp': 'cpp',
    '.cs': 'csharp',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.json': 'json',
    '.md': 'markdown',
    '.css': 'css',
    '.scss': 'scss',
    '.html': 'html',
    '.xml': 'xml',
    '.yml': 'yaml',
    '.yaml': 'yaml',
    '.sh': 'bash',
    '.sql': 'sql',
    '.vue': 'vue',
    '.svelte': 'svelte',
  };
  return map[ext] || 'text';
}

export function DuckyContent({ user, activeLanguage }: DuckyContentProps) {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  // Custom naming & DevDeck alignment:
  // - mode 'Rápido' maps to 'Rápido' (Instant) tab
  // - mode 'Deep Debug' maps to 'Deep Debug' (Expert) tab
  // - mode 'Repositório' maps to GitHub repo analysis
  const [mode, setMode] = useState<'Rápido' | 'Deep Debug' | 'Repositório'>('Rápido');
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [activeRepo, setActiveRepo] = useState<{
    name: string;
    owner: string;
    url: string;
    language: string | null;
  } | null>(null);

  const [thinking, setThinking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stars, setStars] = useState<
    { x: number; y: number; size: number; opacity: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 65 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.6 + 0.7,
      opacity: Math.random() * 0.7 + 0.15,
      delay: Math.random() * 4,
      duration: Math.random() * 4 + 4,
    }));
    setStars(generated);
  }, []);

  // Sync mode and deepThinkActive (Repositório mode disables deep think).
  useEffect(() => {
    setDeepThinkActive(mode === 'Deep Debug');
  }, [mode]);

  const handleDeepThinkToggle = () => {
    const nextVal = !deepThinkActive;
    setDeepThinkActive(nextVal);
    setMode(nextVal ? 'Deep Debug' : 'Rápido');
  };

  // Smooth scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // Auto-resize textarea as typing
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [inputVal]);

  // ---- File attachment handling ----
  const handleFilePick = async (files: FileList | null) => {
    if (!files) return;
    const newFiles: AttachedFile[] = [];
    for (const file of Array.from(files)) {
      if (attachedFiles.length + newFiles.length >= MAX_ATTACHMENTS) {
        alert(`Máximo de ${MAX_ATTACHMENTS} anexos por mensagem.`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" excede o limite de 5MB.`);
        continue;
      }
      const isImage = file.type.startsWith('image/');
      const isCode = !isImage && CODE_EXTENSIONS.includes(fileExtension(file.name));
      if (!isImage && !isCode) {
        alert(`"${file.name}" não é um tipo de arquivo suportado.`);
        continue;
      }
      try {
        if (isImage) {
          const dataUrl = await readFileAsDataURL(file);
          // strip "data:<mime>;base64," prefix
          const base64 = dataUrl.split(',')[1];
          newFiles.push({
            id: Math.random().toString(),
            name: file.name,
            kind: 'image',
            data: base64,
            mimeType: file.type,
          });
        } else {
          const text = await readFileAsText(file);
          newFiles.push({
            id: Math.random().toString(),
            name: file.name,
            kind: 'code',
            data: text,
          });
        }
      } catch {
        alert(`Não foi possível ler "${file.name}".`);
      }
    }
    if (newFiles.length) setAttachedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  /** Converts attached files + typed text into multimodal ContentParts. */
  const buildContentParts = (textToSend: string): ContentPart[] | string => {
    if (attachedFiles.length === 0) return textToSend;
    const parts: ContentPart[] = [];
    for (const f of attachedFiles) {
      if (f.kind === 'image') {
        parts.push({ type: 'image', mimeType: f.mimeType!, data: f.data });
      } else {
        const lang = detectLanguageFromExtension(fileExtension(f.name));
        parts.push({
          type: 'text',
          text: `Arquivo anexado: ${f.name}\n\`\`\`${lang}\n${f.data}\n\`\`\``,
        });
      }
    }
    if (textToSend.trim()) parts.push({ type: 'text', text: textToSend });
    return parts;
  };

  const handleSend = async (textToSend: string) => {
    const hasAttachments = attachedFiles.length > 0;
    if ((!textToSend.trim() && !hasAttachments) || thinking) return;

    // Repo mode requires an active repository for follow-up questions.
    if (mode === 'Repositório' && !activeRepo) return;

    // Append Search or DeepThink hints to query internally if active to improve prompt context
    let finalQuery = textToSend;
    if (searchActive) {
      finalQuery = `[Pesquisa ativa] ${finalQuery}`;
    }

    const content = buildContentParts(finalQuery);

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: typeof content === 'string' ? content : finalQuery,
      attachments: hasAttachments
        ? attachedFiles.map((f) => ({ name: f.name, kind: f.kind }))
        : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setAttachedFiles([]);
    setThinking(true);

    try {
      // Build the history sent to the API, embedding multimodal parts on the
      // current user message.
      const historyPayload = [...messages, userMsg].map((m) => {
        const isCurrent = m.id === userMsg.id;
        if (isCurrent && typeof content !== 'string') {
          return { role: 'user' as const, content };
        }
        return {
          role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
          content: m.text,
        };
      });

      // Repo follow-up: route to the repository endpoint so it injects repo context.
      const endpoint =
        mode === 'Repositório' && activeRepo ? '/api/ai/ducky/repository' : '/api/ai/ducky/chat';

      const payload =
        endpoint === '/api/ai/ducky/repository'
          ? {
              url: activeRepo!.url,
              language: activeLanguage,
              history: historyPayload.map((h) => ({
                role: h.role,
                content: typeof h.content === 'string' ? h.content : '',
              })),
            }
          : { language: activeLanguage, history: historyPayload };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setThinking(false);

      if (response.ok && data.text) {
        const duckyMsgId = Math.random().toString();
        const newDuckyMsg: Message = {
          id: duckyMsgId,
          sender: 'ducky',
          text: '',
          isStreaming: true,
          repo: data.repo,
        };

        setMessages((prev) => [...prev, newDuckyMsg]);

        // Streaming text simulation
        let currentIdx = 0;
        const interval = setInterval(() => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === duckyMsgId) {
                const nextText = data.text.slice(0, currentIdx + 5);
                const done = nextText.length === data.text.length;
                if (done) {
                  clearInterval(interval);
                }
                return {
                  ...msg,
                  text: nextText,
                  isStreaming: !done,
                };
              }
              return msg;
            })
          );
          currentIdx += 5;
        }, 20);
      } else {
        const duckyMsgId = Math.random().toString();
        setMessages((prev) => [
          ...prev,
          {
            id: duckyMsgId,
            sender: 'ducky',
            text:
              data.text ||
              'Quack... Tive um problema ao processar seu código. Pode tentar de novo?',
          },
        ]);
      }
    } catch (err) {
      setThinking(false);
      const duckyMsgId = Math.random().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: duckyMsgId,
          sender: 'ducky',
          text: 'Quack... Tive um problema ao me conectar com os servidores de IA.',
        },
      ]);
    }
  };

  // ---- Repository analysis ----
  const handleRepoAnalyze = async () => {
    const url = repoUrl.trim();
    if (!url || thinking) return;

    setThinking(true);
    // Add a synthetic user message showing the analyzed URL.
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: `🔍 Analisar repositório: ${url}`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setRepoUrl('');

    try {
      const response = await fetch('/api/ai/ducky/repository', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, language: activeLanguage, history: [] }),
      });
      const data = await response.json();
      setThinking(false);

      if (data.repo) {
        setActiveRepo({
          name: data.repo.name,
          owner: data.repo.owner,
          url: data.repo.url,
          language: data.repo.language,
        });
      }

      const duckyMsgId = Math.random().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: duckyMsgId,
          sender: 'ducky',
          text: '',
          isStreaming: true,
          repo: data.repo,
        },
      ]);

      if (data.text) {
        let currentIdx = 0;
        const interval = setInterval(() => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === duckyMsgId) {
                const nextText = data.text.slice(0, currentIdx + 5);
                const done = nextText.length === data.text.length;
                if (done) clearInterval(interval);
                return { ...msg, text: nextText, isStreaming: !done };
              }
              return msg;
            })
          );
          currentIdx += 5;
        }, 20);
      }
    } catch (err) {
      setThinking(false);
      const duckyMsgId = Math.random().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: duckyMsgId,
          sender: 'ducky',
          text: 'Quack... Não consegui analisar o repositório. Verifique a URL e tente de novo.',
        },
      ]);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    let text = '';
    if (suggestionText === 'Explicar Bug') {
      text = '🐛 Quero ajuda para encontrar um bug neste código: \n\n';
    } else if (suggestionText === 'Refatorar Código') {
      text = '⚡ Como posso refatorar e otimizar este código: \n\n';
    } else if (suggestionText === 'Escrever Teste') {
      text = '📝 Escreva testes unitários para a seguinte função: \n\n';
    } else {
      text = suggestionText;
    }

    setInputVal(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const clearHistory = () => {
    if (confirm('Deseja apagar o histórico de conversa com o Ducky?')) {
      setMessages([]);
      setActiveRepo(null);
    }
  };

  // DevDeck Ducky-style input card (Orange accents and custom button names)
  const renderInputCard = () => {
    const repoMode = mode === 'Repositório';
    const repoFollowUp = repoMode && activeRepo;
    return (
      <div className="w-full bg-[#131316]/90 border border-[#232329] rounded-2xl p-4 flex flex-col justify-between min-h-[140px] shadow-2xl focus-within:border-orange-500/40 focus-within:shadow-[0_0_25px_rgba(249,115,22,0.12)] transition-all duration-300 max-w-2xl mx-auto backdrop-blur-md">
        {/* Attachment chips preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachedFiles.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-1.5 pl-2 pr-1 py-1 bg-[#1c1c1f] border border-[#2c2c35] rounded-lg text-[11px] text-dd-text max-w-[200px]"
              >
                {f.kind === 'image' ? (
                  <ImageIcon className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                )}
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(f.id)}
                  className="p-0.5 hover:bg-[#2c2c35] rounded text-[#8b8b93] hover:text-dd-text transition-colors cursor-pointer shrink-0"
                  title="Remover anexo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text area input */}
        <textarea
          ref={inputRef}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (repoFollowUp) handleSend(inputVal);
              else if (!repoMode) handleSend(inputVal);
            }
          }}
          disabled={thinking || (repoMode && !repoFollowUp)}
          placeholder={
            repoFollowUp
              ? `Pergunte sobre ${activeRepo?.name}...`
              : repoMode
                ? 'Cole a URL de um repositório no campo acima para analisar.'
                : 'Perguntar ao Ducky...'
          }
          rows={2}
          className="w-full bg-transparent border-0 outline-0 ring-0 text-sm text-dd-text placeholder-[#53535f] resize-none py-1.5 max-h-36 overflow-y-auto font-sans leading-relaxed focus:ring-0 focus:outline-none disabled:opacity-50"
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between border-t border-[#1f1f23]/40 pt-3 mt-2 select-none">
          {/* Left side: Orange Toggles */}
          <div className="flex items-center gap-2">
            {/* Deep Debug Toggle */}
            <button
              type="button"
              onClick={handleDeepThinkToggle}
              disabled={repoMode}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed ${
                deepThinkActive
                  ? 'bg-[#2a1b15] border-[#7c3a0d] text-[#f97316]'
                  : 'bg-[#1a1a1f] border-[#232329] text-[#8b8b93] hover:bg-[#232329] hover:text-dd-text'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Deep Debug</span>
            </button>

            {/* Buscar Dados Toggle */}
            <button
              type="button"
              onClick={() => setSearchActive(!searchActive)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer select-none ${
                searchActive
                  ? 'bg-[#2a1b15] border-[#7c3a0d] text-[#f97316]'
                  : 'bg-[#1a1a1f] border-[#232329] text-[#8b8b93] hover:bg-[#232329] hover:text-dd-text'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-none stroke-current"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2 12h20" />
              </svg>
              <span>Buscar Dados</span>
            </button>
          </div>

          {/* Right side: Attachment and Send (Orange theme) */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={[...CODE_EXTENSIONS, 'image/*'].join(',')}
              onChange={(e) => handleFilePick(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-[#232329] rounded-full text-[#8b8b93] hover:text-dd-text transition-all cursor-pointer"
              title="Anexar arquivo"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleSend(inputVal)}
              disabled={!inputVal.trim() || thinking || (repoMode && !repoFollowUp)}
              className="p-2 bg-[#f97316] hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-[#f97316] disabled:cursor-not-allowed text-white rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 w-8.5 h-8.5 shadow-md"
              title="Enviar"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4.5 h-4.5 fill-none stroke-current"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBottomBanner = () => {
    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xs md:max-w-sm bg-[#09090b]/80 border border-[#1f1f23] rounded-2xl p-3 flex items-center justify-between gap-4 shadow-xl z-20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
        <div className="flex items-center gap-2.5 text-left">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 text-sm">
            ✨
          </div>
          <div className="font-sans">
            <p className="text-[11px] font-bold text-dd-text">Personalizar o Ducky</p>
            <p className="text-[9px] text-[#71767b] font-medium leading-tight">
              Tenha acesso a mais recursos no Ducky AI Premium
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Recurso premium em breve!')}
          className="px-3 py-1.5 bg-[#f97316] hover:bg-orange-600 text-white text-[10px] font-extrabold rounded-full transition-all cursor-pointer shrink-0 shadow-sm"
        >
          Explorar
        </button>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col md:flex-row h-screen bg-[#060606] text-dd-text antialiased transition-all overflow-hidden ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      {/* Hide sidebar if in fullscreen focus mode */}
      {!isFullscreen && <Sidebar user={user} />}

      <div className="flex-grow flex flex-col min-h-0 min-w-0 bg-[#060606] border-l border-[#1f1f23]/40 relative overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f23]/40 bg-[#060606]/40 backdrop-blur-md sticky top-0 z-20 relative select-none">
          {/* Top Left: Fullscreen Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 border border-[#1f1f23] bg-[#0c0c0e] hover:bg-[#16161a] text-dd-muted hover:text-dd-text rounded-lg transition-all cursor-pointer"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Modo Foco / Tela Cheia'}
            >
              {isFullscreen ? (
                <ArrowLeft className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
            {isFullscreen && (
              <span className="text-xs font-semibold text-[#8b8b93]">Modo Foco</span>
            )}
            {/* Active repo badge */}
            {activeRepo && (
              <a
                href={activeRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0c0c0e] border border-[#1f1f23] hover:border-[#38383e] rounded-lg text-[10px] font-bold text-dd-muted hover:text-dd-text transition-all"
                title={activeRepo.url}
              >
                <Github className="w-3.5 h-3.5 text-orange-500" />
                <span className="max-w-[180px] truncate">
                  {activeRepo.owner}/{activeRepo.name}
                </span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>

          {/* Top Right: História / Privado */}
          <div className="flex items-center gap-2.5">
            {/* History Link / Button */}
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0c0c0e] hover:bg-[#16161a] border border-[#1f1f23] rounded-lg text-[10px] font-bold text-dd-muted hover:text-dd-text transition-all cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>História</span>
              </button>
            )}

            {/* Private Mode Toggle */}
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                isPrivate
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  : 'bg-[#0c0c0e] border-[#1f1f23] hover:bg-[#16161a] text-dd-muted'
              }`}
              title={isPrivate ? 'Histórico pausado (Modo Privado)' : 'Ativar Modo Privado'}
            >
              {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>Privado</span>
            </button>
          </div>
        </header>

        {/* Chat / Welcome Area */}
        {messages.length === 0 ? (
          /* EMPTY STATE (DeepSeek Layout Customized for Ducky) */
          <div className="flex-grow flex flex-col justify-center items-center overflow-y-auto px-4 py-8 max-w-3xl w-full mx-auto relative z-10">
            <div className="w-full max-w-2xl flex flex-col items-center gap-6 text-center -mt-16">
              {/* Ducky IA Branding */}
              <div className="flex items-center justify-center gap-3.5 select-none mb-1 animate-in fade-in zoom-in-95 duration-500">
                <img
                  src="/Logo_ia_ducky.png"
                  alt="Ducky IA Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-bold tracking-tight text-white font-sans">
                  {mode === 'Rápido'
                    ? 'Conversar com o Ducky Rápido'
                    : mode === 'Deep Debug'
                      ? 'Depuração Profunda com o Ducky'
                      : 'Analisar Repositório com o Ducky'}
                </span>
              </div>

              {/* Mode switch tabs capsule (Rápido, Deep Debug, Repositório) */}
              <div className="flex bg-[#111115] border border-[#1f1f23] rounded-full p-1 select-none animate-in fade-in duration-300">
                <button
                  onClick={() => setMode('Rápido')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Rápido'
                      ? 'bg-[#2a1b15] text-[#f97316] shadow-sm'
                      : 'text-[#8b8b93] hover:text-dd-text'
                  }`}
                >
                  <Zap
                    className={`w-3.5 h-3.5 ${mode === 'Rápido' ? 'text-[#f97316] fill-[#f97316]' : ''}`}
                  />
                  <span>Rápido</span>
                </button>

                <button
                  onClick={() => setMode('Deep Debug')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Deep Debug'
                      ? 'bg-[#2a1b15] text-[#f97316] shadow-sm'
                      : 'text-[#8b8b93] hover:text-dd-text'
                  }`}
                >
                  <Terminal
                    className={`w-3.5 h-3.5 ${mode === 'Deep Debug' ? 'text-[#f97316]' : ''}`}
                  />
                  <span>Deep Debug</span>
                </button>

                <button
                  onClick={() => setMode('Repositório')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Repositório'
                      ? 'bg-[#2a1b15] text-[#f97316] shadow-sm'
                      : 'text-[#8b8b93] hover:text-dd-text'
                  }`}
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repositório</span>
                </button>
              </div>

              {/* Repository URL input (only in repo mode) */}
              {mode === 'Repositório' ? (
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 bg-[#131316]/90 border border-[#232329] focus-within:border-orange-500/40 rounded-2xl p-2 shadow-2xl backdrop-blur-md transition-all">
                    <div className="pl-2">
                      <Github className="w-5 h-5 text-[#8b8b93]" />
                    </div>
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRepoAnalyze();
                      }}
                      disabled={thinking}
                      placeholder="github.com/usuario/repositorio"
                      className="flex-grow bg-transparent outline-0 text-sm text-dd-text placeholder-[#53535f] py-2 font-sans disabled:opacity-50"
                    />
                    <button
                      onClick={handleRepoAnalyze}
                      disabled={!repoUrl.trim() || thinking}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#f97316] hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      {thinking ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{thinking ? 'Analisando...' : 'Analisar'}</span>
                    </button>
                  </div>
                  <p className="mt-3 text-[11px] text-[#71767b] flex items-center justify-center gap-1.5 select-none">
                    <Github className="w-3 h-3" />
                    Cole o link de um repositório público (ou privado, se configurado) para análise
                    automática.
                  </p>
                </div>
              ) : (
                /* Centered Ducky Input Card */
                <div className="w-full">{renderInputCard()}</div>
              )}

              {/* Minimal Suggestion pills with icons */}
              {mode !== 'Repositório' && (
                <div className="flex flex-wrap items-center justify-center gap-2.5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <button
                    onClick={() => handleSuggestionClick('Explicar Bug')}
                    className="flex items-center gap-2 px-4 py-2 border border-[#1f1f23] bg-[#0c0c0e]/30 hover:bg-[#16161a]/60 hover:border-[#38383e] text-[11px] font-semibold text-[#8b8b93] hover:text-dd-text rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 fill-none stroke-current text-orange-500"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v2M6 8a6 6 0 0 1 12 0c0 3 2.5 4 2.5 4H3.5S6 11 6 8Z" />
                      <path d="M18 12h-3M6 12H9M15 16H9" />
                      <path d="m19 6-1.5 1.5M5 6l1.5 1.5M12 18v3" />
                    </svg>
                    <span>Explicar Bug</span>
                  </button>
                  <button
                    onClick={() => handleSuggestionClick('Refatorar Código')}
                    className="flex items-center gap-2 px-4 py-2 border border-[#1f1f23] bg-[#0c0c0e]/30 hover:bg-[#16161a]/60 hover:border-[#38383e] text-[11px] font-semibold text-[#8b8b93] hover:text-dd-text rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 fill-none stroke-current text-purple-400"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707m0-12.728.707.707m11.314 11.314.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                    </svg>
                    <span>Refatorar Código</span>
                  </button>
                  <button
                    onClick={() => handleSuggestionClick('Escrever Teste')}
                    className="flex items-center gap-2 px-4 py-2 border border-[#1f1f23] bg-[#0c0c0e]/30 hover:bg-[#16161a]/60 hover:border-[#38383e] text-[11px] font-semibold text-[#8b8b93] hover:text-dd-text rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 fill-none stroke-current text-green-400"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="m9 15 2 2 4-4" />
                    </svg>
                    <span>Escrever Teste</span>
                  </button>
                </div>
              )}
            </div>

            {/* Floating Banner */}
            {renderBottomBanner()}
          </div>
        ) : (
          /* CONVERSATION FLOW (Bubble-free clean thread) */
          <>
            <div className="flex-grow overflow-y-auto scrollbar-ducky relative z-10">
              <div className="px-6 py-6 max-w-3xl w-full mx-auto">
                <div className="flex flex-col w-full pb-6">
                  {isPrivate && (
                    <div className="mb-4 bg-purple-500/5 border border-purple-500/10 p-3.5 rounded-xl flex items-center gap-2.5 text-purple-400 text-xs select-none">
                      <ShieldAlert className="w-4 h-4" />
                      <span>
                        Você está no <strong>Modo Privado</strong>. Suas conversas não ficam salvas
                        na conta.
                      </span>
                    </div>
                  )}

                  {messages.map((msg) => {
                    const isDucky = msg.sender === 'ducky';
                    return isDucky ? (
                      /* DUCKY (AI) MESSAGE: Left-aligned plain text with icons underneath */
                      <div
                        key={msg.id}
                        className="flex flex-col items-start w-full py-4 border-b border-[#1f1f23]/10 animate-in fade-in duration-200"
                      >
                        {/* Repo badge on top of repo-analysis messages */}
                        {msg.repo && !msg.isStreaming && (
                          <a
                            href={msg.repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0c0c0e] border border-[#1f1f23] hover:border-[#38383e] rounded-md text-[10px] font-bold text-dd-muted hover:text-dd-text transition-all"
                          >
                            <Github className="w-3 h-3 text-orange-500" />
                            <span>
                              {msg.repo.owner}/{msg.repo.name}
                            </span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}
                        <div className="max-w-[85%] text-sm text-dd-text leading-relaxed font-sans">
                          <MarkdownRenderer content={msg.text} />
                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-3 bg-orange-500 ml-1 animate-pulse" />
                          )}
                        </div>

                        {/* Action icons below Ducky message */}
                        {!msg.isStreaming && (
                          <div className="flex items-center gap-3.5 mt-2.5 text-[#53535f] select-none">
                            <button
                              onClick={() => navigator.clipboard.writeText(msg.text)}
                              className="hover:text-dd-text transition-colors cursor-pointer"
                              title="Copiar resposta"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleSend(msg.text)}
                              className="hover:text-dd-text transition-colors cursor-pointer"
                              title="Regenerar"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              className="hover:text-dd-text transition-colors cursor-pointer"
                              title="Gostei"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              className="hover:text-dd-text transition-colors cursor-pointer"
                              title="Não gostei"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              className="hover:text-dd-text transition-colors cursor-pointer"
                              title="Compartilhar"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* USER MESSAGE: Right-aligned speech bubble with icons underneath */
                      <div
                        key={msg.id}
                        className="flex flex-col items-end w-full py-3.5 animate-in fade-in duration-200"
                      >
                        {/* Attachment chips above user bubble */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-1.5 justify-end max-w-[70%]">
                            {msg.attachments.map((a, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1 px-2 py-1 bg-[#1c1c1f] border border-[#2c2c35] rounded-md text-[10px] text-dd-text"
                              >
                                {a.kind === 'image' ? (
                                  <ImageIcon className="w-3 h-3 text-orange-500" />
                                ) : (
                                  <FileCode className="w-3 h-3 text-orange-500" />
                                )}
                                <span className="max-w-[120px] truncate">{a.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="bg-[#1c1c1f] hover:bg-[#232328] border border-[#2c2c35]/40 text-dd-text px-4 py-2 rounded-2xl max-w-[70%] text-sm break-words whitespace-pre-wrap font-sans transition-colors">
                          {msg.text}
                        </div>

                        {/* Action icons below user message */}
                        <div className="flex items-center gap-3 mt-1.5 text-[#53535f] select-none mr-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(msg.text)}
                            className="hover:text-dd-text transition-colors cursor-pointer"
                            title="Copiar mensagem"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setInputVal(msg.text);
                              inputRef.current?.focus();
                            }}
                            className="hover:text-dd-text transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Thinking Indicator */}
                  {thinking && (
                    <div className="flex flex-col items-start w-full py-4 border-b border-[#1f1f23]/10 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2.5 text-xs text-[#71767b] py-1 font-sans">
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                        </div>
                        <span>
                          {mode === 'Deep Debug'
                            ? 'Ducky está analisando o escopo do seu projeto...'
                            : mode === 'Repositório'
                              ? 'Ducky está explorando o repositório...'
                              : 'Ducky está analisando seu código...'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              </div>
            </div>

            {/* Bottom Fixed Input Card */}
            <div className="shrink-0 bg-gradient-to-t from-[#060606] via-[#060606] to-[#060606]/80 px-4 pt-2 pb-4 z-20 border-t border-[#1f1f23]/40">
              <div className="max-w-3xl w-full mx-auto flex flex-col items-center">
                {renderInputCard()}

                {/* Premium Promotion Hint */}
                <div className="mt-2.5 text-[9px] text-[#71767b] max-w-xl text-center flex items-center justify-center gap-1.5 select-none">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span>
                    Ducky AI Premium — Tire dúvidas ilimitadas e ative análise de repositórios do
                    GitHub.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---- File reading helpers (browser FileReader API) ----
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
