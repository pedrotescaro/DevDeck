import { AIProviderError } from '../errors';
import type { AIContent, AIMessage } from '../types';

export interface AbortContext {
  signal: AbortSignal;
  cleanup: () => void;
  didTimeout: () => boolean;
}

export function createAbortContext(
  signal: AbortSignal | undefined,
  timeoutMs: number
): AbortContext {
  const controller = new AbortController();
  let timedOut = false;

  const abortFromCaller = () => controller.abort(signal?.reason);
  if (signal?.aborted) {
    abortFromCaller();
  } else {
    signal?.addEventListener('abort', abortFromCaller, { once: true });
  }

  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  return {
    signal: controller.signal,
    didTimeout: () => timedOut,
    cleanup: () => {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abortFromCaller);
    },
  };
}

export function handleFetchError(
  error: unknown,
  provider: string,
  abortContext: AbortContext
): never {
  if (abortContext.didTimeout()) {
    throw new AIProviderError('TIMEOUT', `${provider} request timed out`, provider, undefined, {
      cause: error,
    });
  }

  if (abortContext.signal.aborted) {
    throw new AIProviderError('ABORTED', `${provider} request was aborted`, provider, undefined, {
      cause: error,
    });
  }

  throw new AIProviderError(
    'CONNECTION_FAILED',
    `${provider} connection failed`,
    provider,
    undefined,
    {
      cause: error,
    }
  );
}

export function contentToText(content: AIContent): string {
  if (typeof content === 'string') return content;

  return content.map((part) => (part.type === 'text' ? part.text : '[Imagem anexada]')).join('\n');
}

export function toOpenAIMessage(message: AIMessage, supportsImages: boolean): object {
  if (typeof message.content === 'string') {
    return { role: message.role, content: message.content };
  }

  if (!supportsImages || message.role === 'system') {
    return { role: message.role, content: contentToText(message.content) };
  }

  return {
    role: message.role,
    content: message.content.map((part) =>
      part.type === 'text'
        ? { type: 'text', text: part.text }
        : {
            type: 'image_url',
            image_url: { url: `data:${part.mimeType};base64,${part.data}` },
          }
    ),
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readChatContent(payload: unknown): string | null {
  if (!isRecord(payload) || !Array.isArray(payload.choices)) return null;
  const choice = payload.choices[0];
  if (!isRecord(choice) || !isRecord(choice.message)) return null;
  const content = choice.message.content;
  return typeof content === 'string' && content.trim().length > 0 ? content : null;
}

export function readStreamDelta(payload: unknown): string | null {
  if (!isRecord(payload) || !Array.isArray(payload.choices)) return null;
  const choice = payload.choices[0];
  if (!isRecord(choice) || !isRecord(choice.delta)) return null;
  const content = choice.delta.content;
  return typeof content === 'string' && content.length > 0 ? content : null;
}

export async function readErrorBody(response: Response): Promise<string> {
  return (await response.text().catch(() => '')).slice(0, 1_000);
}
