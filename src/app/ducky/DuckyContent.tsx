'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Sidebar } from '@/components/Sidebar';
import {
  Paperclip,
  History,
  Sparkles,
  Terminal,
  ShieldAlert,
  Lock,
  Unlock,
  X,
  Image as ImageIcon,
} from 'lucide-react';
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

const Zap = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const Target = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const Folder = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" />
  </svg>
);

const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

const FlaskConical = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55A1 1 0 0 0 5.607 22h12.786a1 1 0 0 0 .886-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
    <line x1="8.5" y1="2" x2="15.5" y2="2" />
    <path d="M7 16h10" />
  </svg>
);

const Wrench = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const Bug = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m8 2 1.88 1.88" />
    <path d="M14.12 3.88 16 2" />
    <path d="M9 7.13v-1a3.003 3.003 0 0 1 6 0v1" />
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
    <path d="M12 20v-9" />
    <path d="M6.53 9C4.6 9.8 3 11.4 3 14" />
    <path d="M6 18c-1.5 0-2.5-.5-3-1" />
    <path d="M17.47 9c1.93.8 3.53 2.4 3.53 5" />
    <path d="M18 18c1.5 0 2.5-.5 3-1" />
  </svg>
);

const Gear = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
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
    setDeepThinkActive(false);
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

  const handleDeepThinkToggle = () => {
    setDeepThinkActive((prev) => !prev);
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
    if (deepThinkActive) {
      finalQuery = `[Think Deeper ativo] ${finalQuery}`;
    }
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
            text: data.text || 'Tive um problema ao processar seu código. Pode tentar novamente?',
          },
        ]);
      }
    } catch {
      setThinking(false);
      const duckyMsgId = Math.random().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: duckyMsgId,
          sender: 'ducky',
          text: 'Tive um problema ao me conectar com os servidores de IA.',
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
    } catch {
      setThinking(false);
      const duckyMsgId = Math.random().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: duckyMsgId,
          sender: 'ducky',
          text: 'Não consegui analisar o repositório. Verifique a URL e tente novamente.',
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

  // ASYNC input card
  const renderInputCard = () => {
    const repoMode = mode === 'Repositório';
    const repoFollowUp = repoMode && activeRepo;
    return (
      <div className="mx-auto flex min-h-[148px] w-full max-w-2xl flex-col justify-between rounded-[20px] border border-dd-border bg-dd-surface/60 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500/50">
        {/* Attachment chips preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachedFiles.map((f) => (
              <div
                key={f.id}
                className="flex max-w-[200px] items-center gap-1.5 rounded-lg border border-dd-border bg-dd-bg py-1 pl-2 pr-1 text-[11px] text-dd-text"
              >
                {f.kind === 'image' ? (
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                )}
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(f.id)}
                  className="shrink-0 cursor-pointer rounded p-0.5 text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
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
                : 'Pergunte à ASYNC sobre seu código...'
          }
          rows={2}
          className="max-h-36 w-full resize-none overflow-y-auto border-0 bg-transparent py-1.5 font-sans text-sm leading-relaxed text-dd-text outline-0 ring-0 placeholder:text-dd-muted focus:outline-none focus:ring-0 disabled:opacity-50"
        />

        {/* Bottom row */}
        <div className="mt-2 flex select-none items-center justify-between border-t border-dd-border/60 pt-3">
          {/* Left side: Toggles */}
          <div className="flex items-center gap-2">
            {/* Think Deeper Toggle */}
            <button
              type="button"
              onClick={handleDeepThinkToggle}
              disabled={repoMode}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed ${
                deepThinkActive
                  ? 'border-blue-500/60 bg-blue-500/10 text-[#0083fe]'
                  : 'border-dd-border bg-dd-bg/70 text-dd-muted hover:bg-dd-surface hover:text-dd-text'
              }`}
            >
              <Gear className="w-3.5 h-3.5" />
              <span>Think Deeper</span>
            </button>

            {/* Search Toggle */}
            <button
              type="button"
              onClick={() => setSearchActive(!searchActive)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer select-none ${
                searchActive
                  ? 'border-blue-500/60 bg-blue-500/10 text-[#0083fe]'
                  : 'border-dd-border bg-dd-bg/70 text-dd-muted hover:bg-dd-surface hover:text-dd-text'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Search</span>
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
              className="cursor-pointer rounded-full p-2 text-dd-muted transition-all hover:bg-dd-surface hover:text-dd-text"
              title="Anexar arquivo"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleSend(inputVal)}
              disabled={!inputVal.trim() || thinking || (repoMode && !repoFollowUp)}
              className="p-2 bg-[#0083fe] hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-[#0083fe] disabled:cursor-not-allowed text-white rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 w-8.5 h-8.5 shadow-md"
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
      <div className="absolute bottom-6 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-in select-none items-center justify-between gap-4 rounded-2xl border border-dd-border bg-dd-surface/90 p-3.5 shadow-2xl backdrop-blur-md fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-[#0a1929] border border-[#7c3a0d]/30 flex items-center justify-center text-[#0083fe] text-xs">
            ✨
          </div>
          <div className="font-sans">
            <p className="text-[11px] font-bold leading-tight text-dd-text">Potencialize a ASYNC</p>
            <p className="mt-0.5 text-[9px] font-medium leading-tight text-dd-muted">
              Mais contexto, análises profundas e repositórios completos
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Recurso premium em breve!')}
          className="px-4.5 py-2 bg-[#0083fe] hover:bg-blue-600 text-white text-[10px] font-bold rounded-full transition-all cursor-pointer shrink-0 shadow-md"
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
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-dd-border bg-dd-surface shadow-sm transition-all hover:border-blue-500/40"
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
                      ? 'border-blue-500/20 bg-blue-500/10 font-medium text-dd-text shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'
                      : 'border-transparent bg-transparent text-dd-muted hover:bg-dd-surface/60 hover:text-dd-text'
                  }`}
                >
                  <span className="text-xs truncate flex-1 pr-2 leading-relaxed">{s.title}</span>
                  <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => toggleBookmarkSession(s.id, e)}
                      className="cursor-pointer rounded p-1 text-dd-muted transition-colors hover:bg-dd-surface hover:text-blue-500"
                      title={s.isSaved ? 'Remover dos salvos' : 'Salvar conversa'}
                    >
                      {s.isSaved ? (
                        <BookmarkFilled className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <BookmarkOutline className="w-3.5 h-3.5" />
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
      className={`relative mx-auto flex h-screen w-full flex-col overflow-hidden bg-dd-bg text-dd-text antialiased transition-colors duration-200 md:flex-row ${isFullscreen ? 'max-w-none' : 'max-w-[1225px]'}`}
    >
      {/* Sidebar rendered conditionally based on expanded mode */}
      {!isFullscreen && <Sidebar user={user} />}

      <div
        data-testid="async-content"
        className={`relative flex min-h-0 min-w-0 flex-grow flex-col overflow-hidden bg-dd-bg transition-colors duration-200 ${!isFullscreen ? 'border-r border-dd-border' : ''}`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" />

        {/* Top Header */}
        <header className="relative z-20 flex select-none items-center justify-between border-b border-dd-border/60 bg-dd-bg/80 px-4 py-3 backdrop-blur-xl transition-colors duration-200 sm:px-6">
          {/* Top Left: Expanded mode toggle button */}
          <div className="flex items-center gap-3">
            {isFullscreen ? (
              <button
                onClick={() => setIsFullscreen(false)}
                className="animate-in cursor-pointer rounded-full p-2 text-dd-muted transition-all fade-in duration-300 hover:bg-dd-surface hover:text-dd-text"
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
                className="animate-in cursor-pointer rounded-full p-2 text-dd-muted transition-all fade-in duration-300 hover:bg-dd-surface hover:text-dd-text"
                title="Modo Foco (Ocultar barra lateral)"
              >
                <SidebarIcon className="w-4.5 h-4.5" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <Image
                src="/async-logo.svg"
                alt="ASYNC"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-[0.16em] text-dd-text">ASYNC</span>
                </div>
                <p className="text-[10px] font-medium text-dd-muted">Copiloto de código</p>
              </div>
            </div>
            {activeRepo && (
              <a
                href={activeRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-dd-border bg-dd-surface px-3 py-1.5 text-[10px] font-bold text-dd-muted transition-all hover:border-blue-500/40 hover:text-dd-text"
                title={activeRepo.url}
              >
                <Github className="w-3.5 h-3.5 text-blue-500" />
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
              className="flex items-center gap-1 px-3 py-1.5 text-[#0083fe] font-bold text-xs hover:underline cursor-pointer bg-transparent border-0 transition-colors"
              title="Iniciar nova conversa"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Chat</span>
            </button>

            {/* History Link / Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent px-3 py-1.5 text-xs font-medium text-dd-muted transition-colors hover:text-dd-text"
              title="Ver histórico de conversas"
            >
              <History className="w-3.5 h-3.5" />
              <span>História</span>
            </button>

            {/* Private Mode Toggle */}
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase transition-all cursor-pointer bg-transparent border-0 text-xs ${
                isPrivate ? 'text-purple-400' : 'text-dd-muted hover:text-dd-text'
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
          /* ASYNC welcome state */
          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-grow flex-col items-center justify-center overflow-y-auto px-4 py-8">
            <div className="-mt-10 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
              <div className="flex items-center justify-center gap-3.5 select-none animate-in fade-in zoom-in-95 duration-500">
                <Image
                  src="/async-logo.svg"
                  alt="ASYNC"
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
                <h1 className="font-sans text-3xl font-bold tracking-tight text-dd-text sm:text-4xl">
                  Comece a conversar agora
                </h1>
              </div>

              {/* Mode switch tabs capsule (Rápido, Deep Debug, Repositório) */}
              <div className="flex animate-in select-none rounded-full border border-dd-border bg-dd-surface/60 p-1.5 shadow-xl backdrop-blur-xl fade-in duration-300">
                <button
                  onClick={() => setMode('Rápido')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Rápido'
                      ? 'border border-blue-500/80 bg-blue-500/10 text-[#0083fe] shadow-sm'
                      : 'border border-transparent text-dd-muted hover:text-dd-text'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Rápido</span>
                </button>

                <button
                  onClick={() => setMode('Deep Debug')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Deep Debug'
                      ? 'border border-blue-500/80 bg-blue-500/10 text-[#0083fe] shadow-sm'
                      : 'border border-transparent text-dd-muted hover:text-dd-text'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Deep Debug</span>
                </button>

                <button
                  onClick={() => setMode('Repositório')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Repositório'
                      ? 'border border-blue-500/80 bg-blue-500/10 text-[#0083fe] shadow-sm'
                      : 'border border-transparent text-dd-muted hover:text-dd-text'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>Repositório</span>
                </button>
              </div>

              {/* Repository URL input (only in repo mode) */}
              {mode === 'Repositório' ? (
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 rounded-2xl border border-dd-border bg-dd-surface/60 p-2 shadow-2xl backdrop-blur-md transition-all focus-within:border-blue-500/40">
                    <div className="pl-2">
                      <Github className="h-5 w-5 text-dd-muted" />
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
                      className="flex-grow bg-transparent py-2 font-sans text-sm text-dd-text outline-0 placeholder:text-dd-muted disabled:opacity-50"
                    />
                    <button
                      onClick={handleRepoAnalyze}
                      disabled={!repoUrl.trim() || thinking}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#0083fe] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      {thinking ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{thinking ? 'Analisando...' : 'Analisar'}</span>
                    </button>
                  </div>
                  <p className="mt-3 flex select-none items-center justify-center gap-1.5 text-[11px] text-dd-muted">
                    <Github className="w-3 h-3" />
                    Cole o link de um repositório público (ou privado, se configurado) para análise
                    automática.
                  </p>
                </div>
              ) : (
                /* Centered Ducky Input Card */
                <div className="w-full">{renderInputCard()}</div>
              )}

              {/* Suggestion pills matching reference image */}
              {mode !== 'Repositório' && (
                <div className="flex flex-wrap items-center justify-center gap-2.5 w-full select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <button
                    onClick={() => handleSuggestionClick('Explicar Bug')}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-dd-border bg-dd-surface/50 px-4 py-2 text-xs font-medium text-dd-muted shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-blue-500/30 hover:bg-dd-surface hover:text-dd-text active:scale-[0.98]"
                  >
                    <Gear className="w-3.5 h-3.5 text-blue-400" />
                    <span>Explicar Bug</span>
                  </button>
                  <button
                    onClick={() => handleSuggestionClick('Refatorar Código')}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-dd-border bg-dd-surface/50 px-4 py-2 text-xs font-medium text-dd-muted shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-blue-500/30 hover:bg-dd-surface hover:text-dd-text active:scale-[0.98]"
                  >
                    <Wrench className="w-3.5 h-3.5 text-blue-400" />
                    <span>Refatorar Código</span>
                  </button>
                  <button
                    onClick={() => setMode('Repositório')}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-dd-border bg-dd-surface/50 px-4 py-2 text-xs font-medium text-dd-muted shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-blue-500/30 hover:bg-dd-surface hover:text-dd-text active:scale-[0.98]"
                  >
                    <Folder className="w-3.5 h-3.5 text-blue-400" />
                    <span>Repositório</span>
                  </button>
                  <button
                    onClick={() => handleSuggestionClick('Escrever Testes')}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-dd-border bg-dd-surface/50 px-4 py-2 text-xs font-medium text-dd-muted shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-blue-500/30 hover:bg-dd-surface hover:text-dd-text active:scale-[0.98]"
                  >
                    <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
                    <span>Escrever Testes</span>
                  </button>
                </div>
              )}
            </div>
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
                        className="flex w-full animate-in flex-col items-start border-b border-dd-border/40 py-4 fade-in duration-200"
                      >
                        {/* Repo badge on top of repo-analysis messages */}
                        {msg.repo && !msg.isStreaming && (
                          <a
                            href={msg.repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-2.5 inline-flex items-center gap-1.5 rounded-md border border-dd-border bg-dd-surface px-2.5 py-1 text-[10px] font-bold text-dd-muted transition-all hover:border-blue-500/40 hover:text-dd-text"
                          >
                            <Github className="w-3 h-3 text-blue-500" />
                            <span>
                              {msg.repo.owner}/{msg.repo.name}
                            </span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}
                        <div className="max-w-[85%] text-sm text-dd-text leading-relaxed font-sans">
                          <MarkdownRenderer content={msg.text} />
                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse" />
                          )}
                        </div>

                        {/* Action icons below Ducky message */}
                        {!msg.isStreaming && (
                          <div className="mt-2.5 flex select-none items-center gap-3.5 text-dd-muted">
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
                                className="flex items-center gap-1 rounded-md border border-dd-border bg-dd-surface px-2 py-1 text-[10px] text-dd-text"
                              >
                                {a.kind === 'image' ? (
                                  <>
                                    {a.data ? (
                                      <Image
                                        src={`data:${a.mimeType || 'image/png'};base64,${a.data}`}
                                        alt={a.name}
                                        width={20}
                                        height={20}
                                        className="object-cover rounded mr-1"
                                      />
                                    ) : (
                                      <ImageIcon className="w-3 h-3 text-blue-500" />
                                    )}
                                  </>
                                ) : (
                                  <FileCode className="w-3 h-3 text-blue-500" />
                                )}
                                <span className="max-w-[120px] truncate">{a.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="max-w-[70%] whitespace-pre-wrap break-words rounded-2xl border border-dd-border bg-dd-surface px-4 py-2 font-sans text-sm text-dd-text transition-colors hover:bg-dd-surface/80">
                          {msg.text}
                        </div>

                        {/* Action icons below user message */}
                        <div className="mr-2 mt-1.5 flex select-none items-center gap-3 text-dd-muted">
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
                    <div className="flex w-full animate-in flex-col items-start border-b border-dd-border/40 py-4 fade-in duration-200">
                      <div className="flex items-center gap-2.5 py-1 font-sans text-xs text-dd-muted">
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                        </div>
                        <span>
                          {mode === 'Deep Debug'
                            ? 'ASYNC está analisando o escopo do seu projeto...'
                            : mode === 'Repositório'
                              ? 'ASYNC está explorando o repositório...'
                              : 'ASYNC está analisando seu código...'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              </div>
            </div>

            {/* Bottom Fixed Input Card */}
            <div className="z-20 shrink-0 border-t border-dd-border/60 bg-dd-bg/95 px-4 pb-4 pt-2 backdrop-blur-md">
              <div className="max-w-3xl w-full mx-auto flex flex-col items-center">
                {renderInputCard()}

                {/* Premium Promotion Hint */}
                <div className="mt-2.5 flex max-w-xl select-none items-center justify-center gap-1.5 text-center text-[9px] text-dd-muted">
                  <Sparkles className="w-3 h-3 text-blue-500" />
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

      {/* History Drawer Backdrop Overlay */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* History Drawer Panel */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-[360px] flex-col border-l border-dd-border bg-dd-bg/95 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-out md:max-w-[400px] ${
          isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex shrink-0 select-none items-center gap-4 border-b border-dd-border/60 px-4 pb-3 pt-5">
          <button
            onClick={() => setIsHistoryOpen(false)}
            className="cursor-pointer rounded-full p-1.5 text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
            title="Fechar"
          >
            <X className="w-5 h-5" />
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
                className={`flex-1 py-3 text-center text-xs font-semibold relative transition-colors cursor-pointer ${
                  isActive ? 'font-bold text-dd-text' : 'text-dd-muted hover:text-dd-text'
                }`}
              >
                {labels[tab]}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2.5px] bg-[#0083fe] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="shrink-0 border-b border-dd-border/60 p-4">
          <div className="relative flex items-center rounded-full border border-dd-border bg-dd-surface px-3.5 py-2 transition-colors focus-within:border-blue-500/40">
            <Search className="mr-2.5 h-4 w-4 shrink-0 text-dd-muted" />
            <input
              type="text"
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              placeholder="Pesquisar histórico da ASYNC"
              className="w-full border-none bg-transparent text-xs text-dd-text outline-none placeholder:text-dd-muted"
            />
            {historySearchQuery && (
              <button
                onClick={() => setHistorySearchQuery('')}
                className="shrink-0 cursor-pointer rounded p-0.5 text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
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
