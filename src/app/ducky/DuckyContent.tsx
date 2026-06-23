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

const Flame = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const GitBranch = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const SidebarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="3" rx="4" />
    <path d="M9 3v18" />
  </svg>
);

const Plus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const Search = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const BookmarkOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const BookmarkFilled = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const Trash2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
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
  attachments?: {
    name: string;
    kind: 'image' | 'code';
    data?: string;
    mimeType?: string;
  }[];
  /** Metadata when this message is a repository-analysis result. */
  repo?: { name: string; owner: string; url: string; language: string | null };
}

interface DuckyChatSession {
  id: string;
  title: string;
  messages: Message[];
  activeRepo: {
    name: string;
    owner: string;
    url: string;
    language: string | null;
  } | null;
  mode: 'Rápido' | 'Deep Debug' | 'Repositório';
  isSaved?: boolean;
  createdAt: number;
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
  const [isFullscreen, setIsFullscreen] = useState(true);

  // History drawer states
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<DuckyChatSession[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyActiveTab, setHistoryActiveTab] = useState<'chats' | 'saved' | 'images'>('chats');

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('devdeck-ducky-history');
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
          localStorage.setItem('devdeck-ducky-history', JSON.stringify(next));
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
          localStorage.setItem('devdeck-ducky-history', JSON.stringify(finalHistory));
          return finalHistory;
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [messages, activeChatId, mode, activeRepo, isPrivate]);

  const handleSelectSession = (session: DuckyChatSession) => {
    setActiveChatId(session.id);
    setMessages(session.messages);
    setActiveRepo(session.activeRepo);
    setMode(session.mode);
    setIsHistoryOpen(false);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setActiveRepo(null);
    setInputVal('');
    setAttachedFiles([]);
    setDeepThinkActive(mode === 'Deep Debug');
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
      localStorage.setItem('devdeck-ducky-history', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja apagar esta conversa do seu histórico?')) {
      setHistory((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        localStorage.setItem('devdeck-ducky-history', JSON.stringify(updated));
        return updated;
      });
      if (activeChatId === id) {
        handleNewChat();
      }
    }
  };

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
                const nextText = data.text.slice(0, currentIdx + 15);
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
          currentIdx += 15;
        }, 10);
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
                const nextText = data.text.slice(0, currentIdx + 15);
                const done = nextText.length === data.text.length;
                if (done) clearInterval(interval);
                return { ...msg, text: nextText, isStreaming: !done };
              }
              return msg;
            })
          );
          currentIdx += 15;
        }, 10);
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-[#131316]/90 border border-[#232329] rounded-2xl p-3.5 flex items-center justify-between gap-4 shadow-2xl z-20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-[#2a1b15] border border-[#7c3a0d]/30 flex items-center justify-center text-[#f97316] text-xs">
            ✨
          </div>
          <div className="font-sans">
            <p className="text-[11px] font-bold text-white leading-tight">Personalizar o Ducky</p>
            <p className="text-[9px] text-[#8b8b93] font-medium leading-tight mt-0.5">
              Tenha acesso a mais recursos no Ducky AI Premium
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Recurso premium em breve!')}
          className="px-4.5 py-2 bg-[#f97316] hover:bg-orange-600 text-white text-[10px] font-bold rounded-full transition-all cursor-pointer shrink-0 shadow-md"
        >
          Explorar
        </button>
      </div>
    );
  };

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
          <ImageIcon className="w-8 h-8 text-[#53535f] mb-2" />
          <p className="text-xs text-[#71767b]">Nenhuma imagem encontrada no seu histórico.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectSession(img.session)}
            className="group relative aspect-square bg-[#131316] border border-[#1f1f23] rounded-lg overflow-hidden cursor-pointer hover:border-orange-500/40 transition-all shadow-sm"
            title={`Carregar conversa: "${img.session.title}"`}
          >
            <img
              src={`data:${img.mimeType};base64,${img.data}`}
              alt={img.name}
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
            className="w-8 h-8 text-[#53535f] mb-2 fill-none stroke-current"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-xs text-[#71767b]">
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
            <h3 className="text-[10px] font-bold text-[#71767b] tracking-wider uppercase pl-2.5">
              {gKey}
            </h3>
            <div className="flex flex-col gap-0.5">
              {groups[gKey].map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                    activeChatId === s.id
                      ? 'bg-orange-500/10 border-orange-500/20 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'
                      : 'bg-transparent border-transparent hover:bg-[#131316]/60 text-[#b3b3b9] hover:text-white'
                  }`}
                >
                  <span className="text-xs truncate flex-1 pr-2 leading-relaxed">{s.title}</span>
                  <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => toggleBookmarkSession(s.id, e)}
                      className="p-1 hover:bg-[#1c1c1f] rounded text-[#8b8b93] hover:text-orange-500 transition-colors cursor-pointer"
                      title={s.isSaved ? 'Remover dos salvos' : 'Salvar conversa'}
                    >
                      {s.isSaved ? (
                        <BookmarkFilled className="w-3.5 h-3.5 text-orange-500" />
                      ) : (
                        <BookmarkOutline className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => deleteSession(s.id, e)}
                      className="p-1 hover:bg-[#1c1c1f] rounded text-[#8b8b93] hover:text-red-500 transition-colors cursor-pointer"
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
    <div className="flex flex-col md:flex-row h-screen bg-[#060606] text-dd-text antialiased overflow-hidden">
      {/* Sidebar rendered conditionally based on expanded mode */}
      {!isFullscreen && <Sidebar user={user} />}

      <div
        className={`flex-grow flex flex-col min-h-0 min-w-0 bg-[#060606] relative overflow-hidden ${!isFullscreen ? 'border-l border-[#1f1f23]/40' : ''}`}
      >
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#060606]/40 backdrop-blur-md sticky top-0 z-20 relative select-none">
          {/* Top Left: Expanded mode toggle button */}
          <div className="flex items-center gap-3">
            {isFullscreen ? (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 hover:bg-[#16161a] text-dd-muted hover:text-dd-text rounded-full transition-all cursor-pointer animate-in fade-in duration-300"
                title="Mostrar barra lateral (Sair do modo expandido)"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4.5 h-4.5 fill-none stroke-current"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2 hover:bg-[#16161a] text-[#8b8b93] hover:text-dd-text rounded-full transition-all cursor-pointer animate-in fade-in duration-300"
                title="Modo Foco (Ocultar barra lateral)"
              >
                <SidebarIcon className="w-4.5 h-4.5" />
              </button>
            )}
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

          {/* Top Right: Novo Chat / História / Privado */}
          <div className="flex items-center gap-2.5">
            {/* Novo Chat Button */}
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1 px-3 py-1.5 text-[#f97316] font-bold text-xs hover:underline cursor-pointer bg-transparent border-0 transition-colors"
              title="Iniciar nova conversa"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Chat</span>
            </button>

            {/* History Link / Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[#8b8b93] hover:text-dd-text font-medium text-xs cursor-pointer bg-transparent border-0 transition-colors"
              title="Ver histórico de conversas"
            >
              <History className="w-3.5 h-3.5" />
              <span>História</span>
            </button>

            {/* Private Mode Toggle */}
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase transition-all cursor-pointer bg-transparent border-0 text-xs ${
                isPrivate ? 'text-purple-400' : 'text-[#8b8b93] hover:text-dd-text'
              }`}
              title={isPrivate ? 'Histórico pausado (Modo Privado)' : 'Ativar Modo Privado'}
            >
              {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isPrivate ? 'PRIVADO' : 'PÚBLICO'}</span>
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
                      ? 'bg-[#2a1b15] text-[#f97316] shadow-sm border border-orange-500/10'
                      : 'text-[#8b8b93] hover:text-dd-text'
                  }`}
                >
                  <Flame
                    className={`w-3.5 h-3.5 ${mode === 'Rápido' ? 'text-[#f97316]' : 'text-[#8b8b93]'}`}
                  />
                  <span>Rápido</span>
                </button>

                <button
                  onClick={() => setMode('Deep Debug')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Deep Debug'
                      ? 'bg-[#2a1b15] text-[#f97316] shadow-sm border border-orange-500/10'
                      : 'text-[#8b8b93] hover:text-dd-text'
                  }`}
                >
                  <Terminal
                    className={`w-3.5 h-3.5 ${mode === 'Deep Debug' ? 'text-[#f97316]' : 'text-[#8b8b93]'}`}
                  />
                  <span>Deep Debug</span>
                </button>

                <button
                  onClick={() => setMode('Repositório')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Repositório'
                      ? 'bg-[#2a1b15] text-[#f97316] shadow-sm border border-orange-500/10'
                      : 'text-[#8b8b93] hover:text-dd-text'
                  }`}
                >
                  <GitBranch
                    className={`w-3.5 h-3.5 ${mode === 'Repositório' ? 'text-[#f97316]' : 'text-[#8b8b93]'}`}
                  />
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
                <div className="flex flex-wrap items-center justify-center gap-2.5 w-full select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <button
                    onClick={() => handleSuggestionClick('Explicar Bug')}
                    className="flex items-center gap-2 px-4 py-2 border border-[#232329] bg-[#131316]/90 hover:bg-[#1c1c22] hover:border-[#383842] text-[11px] font-semibold text-[#8b8b93] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
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
                    className="flex items-center gap-2 px-4 py-2 border border-[#232329] bg-[#131316]/90 hover:bg-[#1c1c22] hover:border-[#383842] text-[11px] font-semibold text-[#8b8b93] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 fill-none stroke-current text-purple-400"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                    <span>Refatorar Código</span>
                  </button>
                  <button
                    onClick={() => handleSuggestionClick('Escrever Teste')}
                    className="flex items-center gap-2 px-4 py-2 border border-[#232329] bg-[#131316]/90 hover:bg-[#1c1c22] hover:border-[#383842] text-[11px] font-semibold text-[#8b8b93] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
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
                                  <>
                                    {a.data ? (
                                      <img
                                        src={`data:${a.mimeType || 'image/png'};base64,${a.data}`}
                                        alt={a.name}
                                        className="w-5 h-5 object-cover rounded mr-1"
                                      />
                                    ) : (
                                      <ImageIcon className="w-3 h-3 text-orange-500" />
                                    )}
                                  </>
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

      {/* History Drawer Backdrop Overlay */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* History Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-[360px] md:max-w-[400px] bg-[#0c0c0e]/95 border-l border-[#1f1f23]/60 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out backdrop-blur-md ${
          isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center gap-4 px-4 pt-5 pb-3 border-b border-[#1c1c1f]/40 select-none shrink-0">
          <button
            onClick={() => setIsHistoryOpen(false)}
            className="p-1.5 hover:bg-[#1c1c1f] rounded-full text-[#8b8b93] hover:text-dd-text transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white">História</h2>
        </div>

        {/* Drawer Tabs */}
        <div className="flex px-2 border-b border-[#1c1c1f] select-none shrink-0">
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
                className={`flex-1 py-3 text-center text-xs font-semibold relative transition-colors cursor-pointer ${
                  isActive ? 'text-white font-bold' : 'text-[#8b8b93] hover:text-dd-text'
                }`}
              >
                {labels[tab]}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2.5px] bg-[#f97316] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1c1c1f]/40 shrink-0">
          <div className="relative flex items-center bg-[#131316] border border-[#1f1f23] rounded-full px-3.5 py-2 focus-within:border-orange-500/40 transition-colors">
            <Search className="w-4 h-4 text-[#53535f] mr-2.5 shrink-0" />
            <input
              type="text"
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              placeholder="Pesquisar histórico do Ducky"
              className="bg-transparent border-none outline-none text-xs text-dd-text placeholder-[#53535f] w-full"
            />
            {historySearchQuery && (
              <button
                onClick={() => setHistorySearchQuery('')}
                className="p-0.5 hover:bg-[#1c1c1f] rounded text-[#8b8b93] hover:text-dd-text transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-grow overflow-y-auto scrollbar-ducky p-4">
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
