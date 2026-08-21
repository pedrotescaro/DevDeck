import { AIProviderError } from '../errors';
import { OpenAICompatibleProvider } from './openai-compatible';

const DEFAULT_LOCAL_URL = 'http://127.0.0.1:11434';
const DEFAULT_MODEL = 'async';
const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_REASONING_EFFORT = 'none';

type ReasoningEffort = 'none' | 'low' | 'medium' | 'high';

function getOllamaBaseUrl(): string {
  const configuredUrl = process.env.STACKLYST_AI_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');

  if (process.env.NODE_ENV === 'production') {
    throw new AIProviderError(
      'PROVIDER_NOT_CONFIGURED',
      'STACKLYST_AI_URL is required for Ollama in production',
      'ollama'
    );
  }

  // Development-only compatibility while local environments migrate.
  const legacyUrl = process.env.OLLAMA_API_BASE_URL?.trim();
  if (legacyUrl) return legacyUrl.replace(/\/+$/, '');

  return DEFAULT_LOCAL_URL;
}

function getTimeoutMs(): number {
  const configured = Number(process.env.STACKLYST_AI_TIMEOUT_MS);
  return Number.isFinite(configured) && configured >= 1_000 ? configured : DEFAULT_TIMEOUT_MS;
}

function getReasoningEffort(): ReasoningEffort {
  const configured = process.env.STACKLYST_AI_REASONING?.trim().toLowerCase();
  if (
    configured === 'low' ||
    configured === 'medium' ||
    configured === 'high' ||
    configured === 'none'
  ) {
    return configured;
  }
  return DEFAULT_REASONING_EFFORT;
}

export class OllamaProvider extends OpenAICompatibleProvider {
  constructor() {
    super({
      name: 'ollama',
      getUrl: () => `${getOllamaBaseUrl()}/v1/chat/completions`,
      getModel: () =>
        process.env.STACKLYST_AI_MODEL?.trim() ||
        process.env.OLLAMA_MODEL?.trim() ||
        process.env.AI_MODEL?.trim() ||
        DEFAULT_MODEL,
      timeoutMs: getTimeoutMs,
      getExtraBody: () => ({ reasoning_effort: getReasoningEffort() }),
      mapHttpError: (status, body) => {
        const normalizedBody = body.toLowerCase();
        if (status === 404 && normalizedBody.includes('model')) {
          return new AIProviderError(
            'MODEL_NOT_FOUND',
            `Ollama model was not found: ${body}`,
            'ollama',
            status
          );
        }
        return new AIProviderError(
          'HTTP_ERROR',
          `Ollama returned HTTP ${status}: ${body}`,
          'ollama',
          status
        );
      },
    });
  }
}
