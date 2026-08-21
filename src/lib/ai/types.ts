export type AIRole = 'system' | 'user' | 'assistant';

export type AIContentPart =
  | { type: 'text'; text: string }
  | { type: 'image'; mimeType: string; data: string };

export type AIContent = string | AIContentPart[];

export interface AIMessage {
  role: AIRole;
  content: AIContent;
}

export interface AIRequest {
  messages: AIMessage[];
  temperature?: number;
  responseFormat?: 'text' | 'json';
  signal?: AbortSignal;
}

export interface AIResponse {
  content: string;
}

export interface AIProvider {
  readonly name: string;
  chat(request: AIRequest): Promise<AIResponse>;
  streamChat(request: AIRequest): AsyncGenerator<string>;
}

// Compatibility aliases for the existing chat consumers.
export type ChatContentPart = AIContentPart;
export type ChatContent = AIContent;
export type ChatMessage = Omit<AIMessage, 'role'> & { role: 'user' | 'assistant' };
