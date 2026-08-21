'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Bug,
  Eye,
  FileText,
  FlaskConical,
  Folder,
  Gauge,
  History,
  Image as ImageIcon,
  Loader2,
  Lock,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  Unlock,
  Wrench,
  X,
} from 'lucide-react';
import { AsyncLogo } from '@/components/AsyncLogo';
import Particles from '@/components/Particles';
import { Sidebar } from '@/components/Sidebar';
import { AiInput } from '@/components/chat/ai/ai-input';
import { AiTextLoading } from '@/components/chat/ai/ai-text-loading';
import { AiStateLoading } from '@/components/chat/ai/ai-state-loading';
import { ChatMessageView, type MessageActionsRef } from '@/components/chat/chat-message';
import { ChatScrollButton } from '@/components/chat/chat-scroll-button';
import type {
  AttachedFile,
  ChatEffort,
  ChatMessage,
  ChatMode,
  ChatSpeed,
  ContentPart,
  DuckyChatSession,
} from '@/components/chat/types';

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

/** Fechar sidebar (padrão flyoff — usado quando a sidebar está visível). */
const SidebarClose = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <rect x="3.5" y="4" width="17" height="16" rx="2.25" strokeWidth="2.1" />
    <path
      d="M9 4v16m6.25-11-3 3 3 3"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Abrir sidebar (padrão flyoff — usado quando a sidebar está oculta). */
const SidebarOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <rect x="3.5" y="4" width="17" height="16" rx="2.25" strokeWidth="2.1" />
    <path
      d="M7.5 4v16M11.75 9l3 3-3 3"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

/** Product-level loading steps (no internal reasoning). */
const DEEP_LOADING_STEPS = [
  'Analisando o escopo do projeto...',
  'Consultando arquivos...',
  'Organizando informações...',
  'Preparando resposta...',
];
const REPO_LOADING_STEPS = [
  'Analisando repositório...',
  'Mapeando estrutura do projeto...',
  'Consultando arquivos...',
  'Preparando resposta...',
];

/** Tempo que uma recomendação fechada fica fora do pool (ms). */
const SUGGESTION_COOLDOWN_MS = 10_000;

/** Pool de recomendações de prompt — ao remover uma, outra entra no fim da lista. */
const SUGGESTION_POOL = [
  { id: 'bug', label: 'Explicar Bug', icon: Bug },
  { id: 'refactor', label: 'Refatorar Código', icon: Wrench },
  { id: 'tests', label: 'Escrever Testes', icon: FlaskConical },
  { id: 'repo', label: 'Repositório', icon: Folder },
  { id: 'perf', label: 'Otimizar Desempenho', icon: Gauge },
  { id: 'concept', label: 'Explicar um Conceito', icon: BookOpen },
  { id: 'review', label: 'Revisar Código', icon: Eye },
  { id: 'docs', label: 'Gerar Documentação', icon: FileText },
] as const;

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

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException) return error.name === 'AbortError';
  return (error as { name?: string } | null)?.name === 'AbortError';
}

/** Evento SSE enviado pelos endpoints de chat (texto, erro ou metadados de repo). */
interface SSEEvent {
  text?: string;
  error?: string;
  repo?: { name: string; owner: string; url: string; language: string | null };
}

/** Lê um corpo SSE (text/event-stream) e dispara um callback por evento `data:`. */
async function readSSEStream(
  body: ReadableStream<Uint8Array> | null,
  onEvent: (event: SSEEvent) => void
): Promise<void> {
  if (!body) return;
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split('\n\n');
      buffer = frames.pop() ?? '';
      for (const frame of frames) {
        for (const line of frame.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;
          try {
            onEvent(JSON.parse(payload) as SSEEvent);
          } catch {
            // ignora frames malformados
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

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

export function DuckyContent({ user, activeLanguage }: DuckyContentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const [mode, setMode] = useState<ChatMode>('Rápido');
  const [speed, setSpeed] = useState<ChatSpeed>('Normal');
  const [effort, setEffort] = useState<ChatEffort>('Médio');
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

  // History drawer states
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<DuckyChatSession[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyActiveTab, setHistoryActiveTab] = useState<'chats' | 'saved' | 'images'>('chats');

  // Smart scroll
  const [isAtBottom, setIsAtBottom] = useState(true);
  // Recomendações visíveis no estado vazio (as 4 primeiras do pool)
  const [activeSuggestionIds, setActiveSuggestionIds] = useState<string[]>(() =>
    SUGGESTION_POOL.slice(0, 4).map((s) => s.id)
  );
  // Timestamp até o qual cada recomendação fechada fica oculta
  const [suggestionCooldowns, setSuggestionCooldowns] = useState<Record<string, number>>({});
  // Tema atual (.dark no <html>) para colorir as partículas de fundo
  const [isDark, setIsDark] = useState(() =>
    typeof document === 'undefined' ? true : document.documentElement.classList.contains('dark')
  );
  const reduced = useReducedMotion();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const suggestionTimersRef = useRef<number[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stacklyst-ducky-history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Auto-save active chat to history (debounced to avoid infinite loops during streaming)
  useEffect(() => {
    if (isPrivate || messages.length === 0) return;

    const timeout = setTimeout(() => {
      // Find first user message to determine title
      const userMsgs = messages.filter((m) => m.sender === 'user');
      if (userMsgs.length === 0) return;

      let rawTitle = userMsgs[0].text;
      if (rawTitle.startsWith('[Pesquisa ativa] ')) {
        rawTitle = rawTitle.replace('[Pesquisa ativa] ', '');
      }
      if (rawTitle.startsWith('🔍 Analisar repositório: ')) {
        rawTitle = rawTitle.replace('🔍 Analisar repositório: ', '');
      }
      const derivedTitle = rawTitle.trim()
        ? rawTitle.length > 50
          ? rawTitle.slice(0, 50) + '...'
          : rawTitle
        : 'Conversa com arquivos';

      if (!activeChatId) {
        const newId = 'ducky-chat-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
        const newSession: DuckyChatSession = {
          id: newId,
          title: derivedTitle,
          messages: messages,
          activeRepo: activeRepo,
          mode: mode,
          createdAt: Date.now(),
        };
        setActiveChatId(newId);
        setHistory((prev) => {
          const next = [newSession, ...prev];
          localStorage.setItem('stacklyst-ducky-history', JSON.stringify(next));
          return next;
        });
      } else {
        setHistory((prev) => {
          const updated = prev.map((s) => {
            if (s.id === activeChatId) {
              return {
                ...s,
                title: s.title || derivedTitle,
                messages: messages,
                activeRepo: activeRepo,
                mode: mode,
              };
            }
            return s;
          });
          const exists = updated.some((s) => s.id === activeChatId);
          let finalHistory = updated;
          if (!exists) {
            const newSession: DuckyChatSession = {
              id: activeChatId,
              title: derivedTitle,
              messages: messages,
              activeRepo: activeRepo,
              mode: mode,
              createdAt: Date.now(),
            };
            finalHistory = [newSession, ...updated];
          }
          localStorage.setItem('stacklyst-ducky-history', JSON.stringify(finalHistory));
          return finalHistory;
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [messages, activeChatId, mode, activeRepo, isPrivate]);

  // Cleanup in-flight requests on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      suggestionTimersRef.current.forEach((t) => window.clearTimeout(t));
      suggestionTimersRef.current = [];
    };
  }, []);

  // Smart scroll: follow the conversation while at the bottom; never force
  // scroll down when the user scrolled up to read older messages.
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el || !isAtBottom) return;
    const streaming = messages.some((m) => m.isStreaming);
    el.scrollTo({ top: el.scrollHeight, behavior: streaming ? 'auto' : 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, thinking]);

  const handleScroll = () => {
    const el = chatScrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsAtBottom(distance < 80);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const el = chatScrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  };

  const handleSelectSession = (session: DuckyChatSession) => {
    setActiveChatId(session.id);
    setMessages(session.messages);
    setActiveRepo(session.activeRepo);
    setMode(session.mode);
    setIsHistoryOpen(false);
    setIsAtBottom(true);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setActiveRepo(null);
    setInputVal('');
    setAttachedFiles([]);
    setDeepThinkActive(false);
    setIsAtBottom(true);
    setActiveSuggestionIds(SUGGESTION_POOL.slice(0, 4).map((s) => s.id));
    setSuggestionCooldowns({});
    suggestionTimersRef.current.forEach((t) => window.clearTimeout(t));
    suggestionTimersRef.current = [];
  };

  const toggleBookmarkSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          return { ...s, isSaved: !s.isSaved };
        }
        return s;
      });
      localStorage.setItem('stacklyst-ducky-history', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja apagar esta conversa do seu histórico?')) {
      setHistory((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        localStorage.setItem('stacklyst-ducky-history', JSON.stringify(updated));
        return updated;
      });
      if (activeChatId === id) {
        handleNewChat();
      }
    }
  };

  const handleDeepThinkToggle = () => {
    setDeepThinkActive((prev) => !prev);
  };

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

  /** Consome um stream SSE e vai preenchendo a mensagem do ducky em tempo real. */
  const consumeChatStream = async (
    body: ReadableStream<Uint8Array> | null,
    duckyMsgId: string,
    onEvent?: (event: SSEEvent) => void
  ) => {
    try {
      await readSSEStream(body, (event) => {
        if (event.text) {
          setMessages((prev) =>
            prev.map((m) => (m.id === duckyMsgId ? { ...m, text: m.text + event.text } : m))
          );
        } else if (event.error) {
          const errorText = event.error;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === duckyMsgId ? { ...m, error: true, text: m.text || errorText } : m
            )
          );
        }
        onEvent?.(event);
      });
    } catch (err) {
      if (!isAbortError(err)) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === duckyMsgId
              ? {
                  ...m,
                  error: true,
                  text: m.text || 'Tive um problema ao me conectar com os servidores de IA.',
                }
              : m
          )
        );
      }
    } finally {
      setMessages((prev) =>
        prev.map((m) => (m.id === duckyMsgId ? { ...m, isStreaming: false } : m))
      );
    }
  };

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)));
    setThinking(false);
  };

  const handleSend = async (textToSend: string) => {
    const hasAttachments = attachedFiles.length > 0;
    if ((!textToSend.trim() && !hasAttachments) || thinking) return;

    // Repo mode requires an active repository for follow-up questions.
    if (mode === 'Repositório' && !activeRepo) return;

    // Append Search or DeepThink hints to query internally if active to improve prompt context
    let finalQuery = textToSend;
    if (deepThinkActive) {
      finalQuery = `[Think Deeper ativo] ${finalQuery}`;
    }
    if (searchActive) {
      finalQuery = `[Pesquisa ativa] ${finalQuery}`;
    }
    if (speed === 'Rápida') {
      finalQuery = `[Velocidade rápida — responda de forma concisa e direta] ${finalQuery}`;
    }
    if (effort === 'Alto') {
      finalQuery = `[Esforço alto — responda com profundidade, detalhes e exemplos] ${finalQuery}`;
    } else if (effort === 'Baixo') {
      finalQuery = `[Esforço baixo — responda de forma resumida e direta] ${finalQuery}`;
    }

    const content = buildContentParts(finalQuery);

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      // Exibe apenas o texto limpo na conversa — os hints internos ficam só no payload.
      text: textToSend,
      attachments: hasAttachments
        ? attachedFiles.map((f) => ({
            name: f.name,
            kind: f.kind,
            data: f.data,
            mimeType: f.mimeType,
          }))
        : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setAttachedFiles([]);
    setThinking(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build the history sent to the API, embedding multimodal parts on the
      // current user message.
      const historyPayload = [...messages, userMsg].map((m) => {
        const isCurrent = m.id === userMsg.id;
        if (isCurrent) {
          // A query enviada ao backend inclui os hints internos (esforço,
          // velocidade, busca, think deeper); a conversa exibe só o texto limpo.
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
        signal: controller.signal,
      });

      const contentType = response.headers.get('content-type') ?? '';

      if (!response.ok) {
        setThinking(false);
        let fallbackText = 'Tive um problema ao processar seu código. Pode tentar novamente?';
        if (contentType.includes('application/json')) {
          const data = await response.json().catch(() => ({}));
          if (data.text) fallbackText = data.text;
        }
        const duckyMsgId = Math.random().toString();
        setMessages((prev) => [
          ...prev,
          { id: duckyMsgId, sender: 'ducky', error: true, text: fallbackText },
        ]);
        return;
      }

      if (contentType.includes('text/event-stream')) {
        const duckyMsgId = Math.random().toString();
        setMessages((prev) => [
          ...prev,
          { id: duckyMsgId, sender: 'ducky', text: '', isStreaming: true },
        ]);
        setThinking(false);
        await consumeChatStream(response.body, duckyMsgId);
      } else {
        // Fallback JSON defensivo (os endpoints agora transmitem via SSE).
        const data = await response.json().catch(() => ({}));
        setThinking(false);
        const duckyMsgId = Math.random().toString();
        if (data.text) {
          setMessages((prev) => [...prev, { id: duckyMsgId, sender: 'ducky', text: data.text }]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: duckyMsgId,
              sender: 'ducky',
              error: true,
              text: 'Tive um problema ao processar seu código. Pode tentar novamente?',
            },
          ]);
        }
      }
    } catch (err) {
      if (isAbortError(err)) return; // user stopped generation
      setThinking(false);
      const duckyMsgId = Math.random().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: duckyMsgId,
          sender: 'ducky',
          error: true,
          text: 'Tive um problema ao me conectar com os servidores de IA.',
        },
      ]);
    } finally {
      abortControllerRef.current = null;
    }
  };

  // ---- Repository analysis ----
  const handleRepoAnalyze = async () => {
    const url = repoUrl.trim();
    if (!url || thinking) return;

    setThinking(true);
    // Add a synthetic user message showing the analyzed URL.
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: `🔍 Analisar repositório: ${url}`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setRepoUrl('');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/ai/ducky/repository', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, language: activeLanguage, history: [] }),
        signal: controller.signal,
      });

      const contentType = response.headers.get('content-type') ?? '';

      if (!response.ok) {
        setThinking(false);
        let fallbackText =
          'Não consegui analisar o repositório. Verifique a URL e tente novamente.';
        if (contentType.includes('application/json')) {
          const data = await response.json().catch(() => ({}));
          if (data.text) fallbackText = data.text;
        }
        const duckyMsgId = Math.random().toString();
        setMessages((prev) => [
          ...prev,
          { id: duckyMsgId, sender: 'ducky', error: true, text: fallbackText },
        ]);
        return;
      }

      if (contentType.includes('text/event-stream')) {
        const duckyMsgId = Math.random().toString();
        setMessages((prev) => [
          ...prev,
          { id: duckyMsgId, sender: 'ducky', text: '', isStreaming: true },
        ]);
        setThinking(false);

        await consumeChatStream(response.body, duckyMsgId, (event) => {
          if (event.repo) {
            setActiveRepo({
              name: event.repo.name,
              owner: event.repo.owner,
              url: event.repo.url,
              language: event.repo.language,
            });
            setMessages((prev) =>
              prev.map((m) => (m.id === duckyMsgId ? { ...m, repo: event.repo } : m))
            );
          }
        });
      } else {
        // Fallback JSON defensivo (os endpoints agora transmitem via SSE).
        const data = await response.json().catch(() => ({}));
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
          data.text
            ? { id: duckyMsgId, sender: 'ducky', text: data.text, repo: data.repo }
            : {
                id: duckyMsgId,
                sender: 'ducky',
                error: true,
                text: 'Não consegui analisar o repositório. Verifique a URL e tente novamente.',
              },
        ]);
      }
    } catch (err) {
      if (isAbortError(err)) return; // user stopped generation
      setThinking(false);
      const duckyMsgId = Math.random().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: duckyMsgId,
          sender: 'ducky',
          error: true,
          text: 'Não consegui analisar o repositório. Verifique a URL e tente novamente.',
        },
      ]);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    let text = '';
    if (suggestionText === 'Explicar Bug') {
      text = '🐛 Quero ajuda para encontrar um bug neste código: \n\n';
    } else if (suggestionText === 'Refatorar Código') {
      text = '⚡ Como posso refatorar e otimizar este código: \n\n';
    } else if (suggestionText === 'Escrever Testes') {
      text = '📝 Escreva testes unitários para a seguinte função: \n\n';
    } else {
      text = suggestionText;
    }

    setInputVal(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  /** Remove uma recomendação, puxa outra do pool e agenda o retorno da fechada após ~10s.
   *  A lista sempre mantém exatamente 4 itens: ao voltar, a fechada substitui a
   *  recomendação que entrou no lugar dela (em vez de ser apenas adicionada ao fim). */
  const dismissSuggestion = (id: string) => {
    const now = Date.now();
    setSuggestionCooldowns((prev) => ({ ...prev, [id]: now + SUGGESTION_COOLDOWN_MS }));

    const next = activeSuggestionIds.filter((x) => x !== id);
    const replacement = SUGGESTION_POOL.find(
      (s) => !next.includes(s.id) && s.id !== id && (suggestionCooldowns[s.id] ?? 0) < now
    );
    const replacementId = replacement?.id ?? null;
    setActiveSuggestionIds(replacement ? [...next, replacement.id] : next);

    // A fechada volta sozinha no lugar da substituta depois do cooldown.
    suggestionTimersRef.current.push(
      window.setTimeout(() => {
        setActiveSuggestionIds((prev) => {
          if (prev.includes(id)) return prev;
          // Remove a substituta da vez e devolve a fechada.
          const withoutReplacement = replacementId ? prev.filter((x) => x !== replacementId) : prev;
          const withReturned = withoutReplacement.includes(id)
            ? withoutReplacement
            : [...withoutReplacement, id];
          // Segurança: nunca mostrar mais de 4 recomendações de uma vez.
          return withReturned.length > 4 ? withReturned.slice(0, 4) : withReturned;
        });
        setSuggestionCooldowns((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, SUGGESTION_COOLDOWN_MS)
    );
  };

  // Stable callbacks registry for memoized chat messages.
  const messageActionsRef = useRef<MessageActionsRef>({
    regenerate: () => {},
    edit: () => {},
    retry: () => {},
  });
  messageActionsRef.current = {
    regenerate: (text) => {
      void handleSend(text);
    },
    edit: (text) => {
      setInputVal(text);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    },
    retry: (id) => {
      const idx = messages.findIndex((m) => m.id === id);
      if (idx < 0) return;
      const prevUser = messages
        .slice(0, idx)
        .reverse()
        .find((m) => m.sender === 'user');
      if (prevUser) void handleSend(prevUser.text);
    },
  };

  const repoMode = mode === 'Repositório';
  const repoFollowUp = repoMode && activeRepo;
  const composerDisabled = thinking || (repoMode && !repoFollowUp);
  const composerPlaceholder = repoFollowUp
    ? `Pergunte sobre ${activeRepo?.name}...`
    : repoMode
      ? 'Cole a URL de um repositório no campo acima para analisar.'
      : 'Pergunte qualquer coisa...';

  const renderComposer = () => (
    <AiInput
      value={inputVal}
      onChange={setInputVal}
      onSubmit={(text) => void handleSend(text)}
      onStop={stopGeneration}
      disabled={composerDisabled}
      placeholder={composerPlaceholder}
      thinking={thinking}
      mode={mode}
      onModeChange={setMode}
      speed={speed}
      onSpeedChange={setSpeed}
      effort={effort}
      onEffortChange={setEffort}
      searchEnabled={searchActive}
      onToggleSearch={() => setSearchActive((s) => !s)}
      deepThinkEnabled={deepThinkActive}
      onToggleDeepThink={handleDeepThinkToggle}
      deepThinkDisabled={repoMode}
      attachments={attachedFiles}
      onRemoveAttachment={removeAttachment}
      onPickAttachments={() => fileInputRef.current?.click()}
    />
  );

  const renderThinking = () => (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full"
      aria-live="polite"
    >
      <div className="min-w-0 pt-1">
        {mode === 'Repositório' ? (
          <AiStateLoading steps={REPO_LOADING_STEPS} />
        ) : mode === 'Deep Debug' ? (
          <AiStateLoading steps={DEEP_LOADING_STEPS} />
        ) : (
          <AiTextLoading />
        )}
      </div>
    </motion.div>
  );

  const renderImagesTab = () => {
    const images: { data: string; mimeType: string; session: DuckyChatSession; name: string }[] =
      [];
    const query = historySearchQuery.trim().toLowerCase();
    const filteredHistory = history.filter((s) => {
      if (!query) return true;
      if (s.title.toLowerCase().includes(query)) return true;
      return s.messages.some((m) => m.text.toLowerCase().includes(query));
    });

    filteredHistory.forEach((s) => {
      s.messages.forEach((m) => {
        if (m.attachments) {
          m.attachments.forEach((a) => {
            if (a.kind === 'image' && a.data) {
              images.push({
                data: a.data,
                mimeType: a.mimeType || 'image/png',
                session: s,
                name: a.name,
              });
            }
          });
        }
      });
    });

    if (images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center select-none">
          <ImageIcon className="mb-2 h-8 w-8 text-dd-muted" />
          <p className="text-xs text-dd-muted">Nenhuma imagem encontrada no seu histórico.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectSession(img.session)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-dd-border bg-dd-surface shadow-sm transition-all hover:border-dd-text/40"
            title={`Carregar conversa: "${img.session.title}"`}
          >
            <Image
              src={`data:${img.mimeType};base64,${img.data}`}
              alt={img.name}
              width={200}
              height={200}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-1.5 transition-opacity">
              <span className="text-[9px] text-white truncate w-full font-medium">
                {img.session.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChatsTab = () => {
    const query = historySearchQuery.trim().toLowerCase();
    const isSavedOnly = historyActiveTab === 'saved';

    const filtered = history.filter((s) => {
      if (isSavedOnly && !s.isSaved) return false;
      if (!query) return true;
      if (s.title.toLowerCase().includes(query)) return true;
      return s.messages.some((m) => m.text.toLowerCase().includes(query));
    });

    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center select-none">
          <svg
            viewBox="0 0 24 24"
            className="mb-2 h-8 w-8 fill-none stroke-current text-dd-muted"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-xs text-dd-muted">
            {isSavedOnly ? 'Nenhum item salvo encontrado.' : 'Nenhuma conversa encontrada.'}
          </p>
        </div>
      );
    }

    const formatGroupDate = (timestamp: number) => {
      const date = new Date(timestamp);
      const now = new Date();
      const isSameDay = (d1: Date, d2: Date) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);

      if (isSameDay(date, now)) return 'Hoje';
      if (isSameDay(date, yesterday)) return 'Ontem';

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      if (date > oneWeekAgo) return 'Esta semana';

      const monthsShort = [
        'jan',
        'fev',
        'mar',
        'abr',
        'mai',
        'jun',
        'jul',
        'ago',
        'set',
        'out',
        'nov',
        'dez',
      ];
      return `${date.getDate()} de ${monthsShort[date.getMonth()]} de ${date.getFullYear()}`;
    };

    const groups: { [key: string]: DuckyChatSession[] } = {};
    filtered.forEach((s) => {
      const gKey = formatGroupDate(s.createdAt);
      if (!groups[gKey]) groups[gKey] = [];
      groups[gKey].push(s);
    });

    const orderedGroupKeys = Object.keys(groups);

    return (
      <div className="flex flex-col gap-5 select-none">
        {orderedGroupKeys.map((gKey) => (
          <div key={gKey} className="flex flex-col gap-1.5">
            <h3 className="pl-2.5 text-[10px] font-bold uppercase tracking-wider text-dd-muted">
              {gKey}
            </h3>
            <div className="flex flex-col gap-0.5">
              {groups[gKey].map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                    activeChatId === s.id
                      ? 'border-dd-text/20 bg-dd-text/10 font-medium text-dd-text shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'
                      : 'border-transparent bg-transparent text-dd-muted hover:bg-dd-surface/60 hover:text-dd-text'
                  }`}
                >
                  <span className="text-xs truncate flex-1 pr-2 leading-relaxed">{s.title}</span>
                  <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => toggleBookmarkSession(s.id, e)}
                      className="cursor-pointer rounded p-1 text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
                      title={s.isSaved ? 'Remover dos salvos' : 'Salvar conversa'}
                    >
                      {s.isSaved ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-dd-text" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => deleteSession(s.id, e)}
                      className="cursor-pointer rounded p-1 text-dd-muted transition-colors hover:bg-dd-surface hover:text-red-500"
                      title="Excluir conversa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      data-testid="async-shell"
      className={`dd-platform-shell relative h-dvh overflow-hidden transition-colors duration-200 ${isFullscreen ? 'dd-platform-shell--fullscreen' : ''}`}
    >
      {/* Sidebar — no mobile é o header + nav inferior nativo do app; no
          desktop usa animação de largura (0 ↔ auto) ao alternar o modo foco. */}
      {!isFullscreen && (
        <div className="md:hidden">
          <Sidebar user={user} />
        </div>
      )}
      <AnimatePresence initial={false}>
        {!isFullscreen && (
          <motion.div
            key="async-sidebar"
            initial={reduced ? false : { width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { width: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden shrink-0 overflow-visible md:block"
            aria-hidden={isFullscreen}
          >
            <Sidebar user={user} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        data-testid="async-content"
        className={`relative flex min-h-0 min-w-0 flex-grow flex-col overflow-hidden bg-dd-bg transition-colors duration-200 ${!isFullscreen ? 'border-r border-dd-border' : ''}`}
      >
        {/* Fundo com partículas sutis (React Bits) atrás de todo o conteúdo —
            brancas no dark, pretas no light; key força rebuild ao trocar de tema */}
        {!reduced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-70"
          >
            <Particles
              key={isDark ? 'particles-dark' : 'particles-light'}
              particleColors={[isDark ? '#ffffff' : '#0f1419']}
              particleCount={40}
              particleSpread={6}
              speed={0.05}
              particleBaseSize={60}
              sizeRandomness={0.8}
              alphaParticles
              cameraDistance={24}
              moveParticlesOnHover
              particleHoverFactor={0.6}
            />
          </div>
        )}

        {/* Top Header */}
        <header className="relative z-20 flex min-h-14 select-none items-center justify-between border-b border-dd-border/60 bg-dd-bg/30 px-2 py-2 backdrop-blur-md transition-colors duration-200 sm:px-6 sm:py-3">
          {/* Top Left */}
          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            {isFullscreen ? (
              <button
                onClick={() => setIsFullscreen(false)}
                className="animate-in flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-dd-muted transition-all fade-in duration-300 hover:bg-dd-surface hover:text-dd-text sm:size-9"
                title="Mostrar barra lateral (Sair do modo expandido)"
                aria-label="Mostrar barra lateral"
              >
                <SidebarOpen className="h-4.5 w-4.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsFullscreen(true)}
                className="animate-in flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-dd-muted transition-all fade-in duration-300 hover:bg-dd-surface hover:text-dd-text sm:size-9"
                title="Modo Foco (Ocultar barra lateral)"
                aria-label="Modo Foco"
              >
                <SidebarClose className="h-4.5 w-4.5" />
              </button>
            )}
            <div className="flex min-w-0 items-center gap-2.5">
              <AsyncLogo width={24} height={24} className="h-6 w-6 object-contain" />
              <span className="hidden text-xl leading-none tracking-[0.16em] text-dd-text sm:block">
                ASYNC
              </span>
            </div>
            {activeRepo && (
              <a
                href={activeRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden min-w-0 items-center gap-1.5 rounded-lg border border-dd-border bg-dd-surface px-3 py-1.5 text-[10px] font-bold text-dd-muted transition-all hover:border-dd-text/40 hover:text-dd-text sm:flex"
                title={activeRepo.url}
              >
                <Github className="h-3.5 w-3.5 text-dd-text" />
                <span className="max-w-[120px] truncate lg:max-w-[180px]">
                  {activeRepo.owner}/{activeRepo.name}
                </span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            )}
          </div>

          {/* Top Right */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2.5">
            <button
              onClick={handleNewChat}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-full text-xs font-bold text-dd-text transition-colors hover:bg-dd-surface sm:h-9 sm:w-auto sm:rounded-none sm:px-3 sm:hover:bg-transparent sm:hover:underline"
              title="Iniciar nova conversa"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Novo Chat</span>
            </button>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border-0 bg-transparent text-xs font-medium text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text sm:h-9 sm:w-auto sm:rounded-none sm:px-3 sm:hover:bg-transparent"
              title="Ver histórico de conversas"
            >
              <History className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">História</span>
            </button>

            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex size-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border-0 bg-transparent text-xs font-bold uppercase transition-all hover:bg-dd-surface sm:h-9 sm:w-auto sm:rounded-none sm:px-3 sm:hover:bg-transparent ${
                isPrivate ? 'text-dd-purple' : 'text-dd-muted hover:text-dd-text'
              }`}
              title={isPrivate ? 'Histórico pausado (Modo Privado)' : 'Ativar Modo Privado'}
              aria-pressed={isPrivate}
            >
              {isPrivate ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isPrivate ? 'PRIVADO' : 'PÚBLICO'}</span>
            </button>
          </div>
        </header>

        {messages.length === 0 ? (
          /* ── Welcome / empty state ── */
          <div className="relative z-10 flex min-h-0 flex-grow flex-col overflow-y-auto overscroll-contain">
            <div className="mx-auto flex w-full max-w-2xl flex-grow flex-col items-center justify-start gap-4 px-3 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-6 sm:justify-center sm:gap-6 sm:px-6 sm:pb-28 sm:pt-10">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex select-none flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
                  <AsyncLogo
                    width={40}
                    height={40}
                    className="h-9 w-9 object-contain sm:h-11 sm:w-11"
                  />
                  <h1 className="text-balance text-xl font-bold leading-tight tracking-tight text-dd-text sm:text-3xl">
                    O que você está desenvolvendo?
                  </h1>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-dd-muted">
                  Pergunte qualquer coisa sobre seu código, tire dúvidas de programação ou analise
                  repositórios do GitHub.
                </p>
              </div>

              {mode === 'Repositório' ? (
                /* Repository URL input — o composer (com o menu de modo) fica logo abaixo */
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 rounded-xl border border-dd-border/60 bg-dd-surface/40 p-1.5 shadow-sm transition-all focus-within:border-dd-text/40 focus-within:ring-1 focus-within:ring-dd-text/15">
                    <div className="pl-2">
                      <Github className="h-4 w-4 text-dd-muted" />
                    </div>
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void handleRepoAnalyze();
                      }}
                      disabled={thinking}
                      placeholder="github.com/usuario/repositorio"
                      aria-label="URL do repositório no GitHub"
                      className="min-w-0 flex-grow bg-transparent py-2 font-sans text-sm text-dd-text outline-none placeholder:text-dd-muted disabled:opacity-50"
                    />
                    <button
                      onClick={() => void handleRepoAnalyze()}
                      disabled={!repoUrl.trim() || thinking}
                      className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-dd-text px-3.5 py-2 text-xs font-semibold text-dd-bg transition-colors hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {thinking ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      <span>{thinking ? 'Analisando...' : 'Analisar'}</span>
                    </button>
                  </div>
                  <p className="mt-2.5 flex select-none items-center justify-center gap-1.5 text-[11px] text-dd-muted">
                    <Github className="h-3 w-3" />
                    Cole o link de um repositório público (ou privado, se configurado) para análise
                    automática.
                  </p>
                  {renderComposer()}
                </div>
              ) : (
                /* Composer + prompt suggestions */
                <div className="w-full">
                  {renderComposer()}

                  {/* Prompt suggestions — lista vertical alinhada à esquerda do input (estilo ChatGPT) */}
                  <AnimatePresence initial={false}>
                    {inputVal.trim().length === 0 && (
                      <motion.div
                        key="prompt-suggestions"
                        initial={reduced ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, y: 4 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                        className="mt-3 flex w-full flex-col items-start gap-0.5"
                      >
                        {activeSuggestionIds.map((id) => {
                          const item = SUGGESTION_POOL.find((s) => s.id === id);
                          if (!item) return null;
                          const Icon = item.icon;
                          const isRepo = id === 'repo';
                          return (
                            <motion.div
                              key={id}
                              initial={reduced ? false : { opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.16, ease: 'easeOut' }}
                              className="group relative w-full"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  isRepo
                                    ? setMode('Repositório')
                                    : handleSuggestionClick(item.label)
                                }
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text focus-visible:bg-dd-surface focus-visible:text-dd-text focus-visible:outline-none"
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0 text-dd-text" />
                                <span className="truncate pr-5">{item.label}</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dismissSuggestion(id);
                                }}
                                aria-label={`Remover sugestão ${item.label}`}
                                title="Remover sugestão"
                                className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-dd-muted transition-opacity hover:bg-dd-border/60 hover:text-dd-text focus-visible:opacity-100 focus-visible:outline-none md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                              >
                                <X className="size-3.5" />
                              </button>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Conversation flow ── */
          <>
            <div className="relative z-10 flex min-h-0 flex-grow flex-col">
              <div
                ref={chatScrollRef}
                onScroll={handleScroll}
                className="flex-grow overflow-y-auto overscroll-contain scrollbar-ducky"
              >
                <div className="mx-auto w-full max-w-3xl px-3 py-4 sm:px-6 sm:py-6">
                  <div className="flex flex-col gap-5 pb-6 sm:gap-7 sm:pb-8">
                    {isPrivate && (
                      <div className="flex items-center gap-2.5 rounded-xl border border-dd-purple/10 bg-dd-purple/5 p-3.5 text-xs text-dd-purple select-none">
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        <span>
                          Você está no <strong>Modo Privado</strong>. Suas conversas não ficam
                          salvas na conta.
                        </span>
                      </div>
                    )}

                    {messages.map((msg) => (
                      <ChatMessageView key={msg.id} message={msg} actionsRef={messageActionsRef} />
                    ))}

                    {thinking && renderThinking()}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {!isAtBottom && <ChatScrollButton onClick={() => scrollToBottom('smooth')} />}
              </AnimatePresence>
            </div>

            {/* Composer fixo — sem linha divisória nem fundo próprio, o fundo do
                chat (com as partículas) aparece por trás em toda a área.
                No mobile, pb-24 afasta o input da barra de navegação inferior. */}
            <div className="relative z-20 shrink-0 px-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pt-3 md:pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="mx-auto w-full max-w-3xl">
                {renderComposer()}

                <div className="mt-2.5 hidden select-none items-center justify-center gap-1.5 text-center text-[9px] text-dd-muted sm:flex">
                  <Sparkles className="h-3 w-3 text-dd-text" />
                  <span>
                    ASYNC Premium — Tire dúvidas ilimitadas e ative análise de repositórios do
                    GitHub.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hidden file input (shared by composer states) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={[...CODE_EXTENSIONS, 'image/*'].join(',')}
        onChange={(e) => void handleFilePick(e.target.files)}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* History Drawer Backdrop Overlay */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* History Drawer Panel */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[360px] flex-col border-l border-dd-border bg-dd-bg/95 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-out md:max-w-[400px] ${
          isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex shrink-0 select-none items-center gap-4 border-b border-dd-border/60 px-4 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <button
            onClick={() => setIsHistoryOpen(false)}
            className="cursor-pointer rounded-full p-1.5 text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
            title="Fechar"
            aria-label="Fechar histórico"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-base font-bold text-dd-text">História</h2>
        </div>

        {/* Drawer Tabs */}
        <div className="flex shrink-0 select-none border-b border-dd-border px-2">
          {(['chats', 'saved', 'images'] as const).map((tab) => {
            const isActive = historyActiveTab === tab;
            const labels = {
              chats: 'Chats',
              saved: 'Itens salvos',
              images: 'Imagens',
            };
            return (
              <button
                key={tab}
                onClick={() => setHistoryActiveTab(tab)}
                className={`relative flex-1 cursor-pointer py-3 text-center text-xs font-semibold transition-colors ${
                  isActive ? 'font-bold text-dd-text' : 'text-dd-muted hover:text-dd-text'
                }`}
                aria-pressed={isActive}
              >
                {labels[tab]}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-[2.5px] w-1/2 -translate-x-1/2 rounded-full bg-dd-text" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="shrink-0 border-b border-dd-border/60 p-4">
          <div className="relative flex items-center rounded-full border border-dd-border bg-dd-surface px-3.5 py-2 transition-colors focus-within:border-dd-text/40">
            <Search className="mr-2.5 h-4 w-4 shrink-0 text-dd-muted" />
            <input
              type="text"
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              placeholder="Pesquisar histórico da ASYNC"
              aria-label="Pesquisar histórico"
              className="w-full border-none bg-transparent text-xs text-dd-text outline-none placeholder:text-dd-muted"
            />
            {historySearchQuery && (
              <button
                onClick={() => setHistorySearchQuery('')}
                className="shrink-0 cursor-pointer rounded p-0.5 text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
                aria-label="Limpar busca"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-grow overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] scrollbar-ducky">
          {historyActiveTab === 'images' ? renderImagesTab() : renderChatsTab()}
        </div>
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
