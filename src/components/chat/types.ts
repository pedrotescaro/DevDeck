/** A single piece of multimodal content (text or image) sent to the AI. */
export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image'; mimeType: string; data: string };

/** File picked by the user, before being converted to ContentParts on send. */
export interface AttachedFile {
  id: string;
  name: string;
  kind: 'image' | 'code';
  /** For images: raw base64 (no prefix). For code: the file text. */
  data: string;
  mimeType?: string;
}

/** Attachment metadata stored on an already-sent user message. */
export interface AttachmentMeta {
  name: string;
  kind: 'image' | 'code';
  data?: string;
  mimeType?: string;
}

/** Repository info attached to repository-analysis messages. */
export interface RepoInfo {
  name: string;
  owner: string;
  url: string;
  language: string | null;
}

export type ChatMode = 'Rápido' | 'Deep Debug' | 'Repositório';

export type ChatSpeed = 'Normal' | 'Rápida';

export type ChatEffort = 'Baixo' | 'Médio' | 'Alto';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ducky';
  text: string;
  isStreaming?: boolean;
  /** Multimodal parts attached to a user message (images + code). */
  attachments?: AttachmentMeta[];
  /** Metadata when this message is a repository-analysis result. */
  repo?: RepoInfo;
  /** Marks a failed generation so the UI can offer a retry. */
  error?: boolean;
}

export interface DuckyChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  activeRepo: RepoInfo | null;
  mode: ChatMode;
  isSaved?: boolean;
  createdAt: number;
}
