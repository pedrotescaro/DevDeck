import { z } from 'zod';
import { logger } from '@/lib/logger';
import { AIProviderError } from './errors';
import { GeminiProvider } from './providers/gemini';
import { GroqProvider } from './providers/groq';
import { OllamaProvider } from './providers/ollama';
import { OpenAIProvider } from './providers/openai';
import { withStacklystBasePrompt } from './prompts/base';
import type { AIMessage, AIProvider, AIRequest, AIResponse, ChatMessage } from './types';

export * from './errors';
export * from './prompts';
export type * from './types';

export type AIProviderName = 'gemini' | 'groq' | 'ollama' | 'openai';

export const AIQuizResponseSchema = z.object({
  question: z.string().min(5).max(500),
  options: z.array(z.string().min(1).max(200)).length(4),
  correct_index: z.number().int().min(0).max(3),
  explanation: z.string().max(2_000).optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
});

export type AIQuizResponse = z.infer<typeof AIQuizResponseSchema>;

function resolveProviderName(): AIProviderName {
  const configured = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (configured) {
    if (
      configured === 'gemini' ||
      configured === 'groq' ||
      configured === 'ollama' ||
      configured === 'openai'
    ) {
      return configured;
    }
    throw new AIProviderError(
      'UNSUPPORTED_PROVIDER',
      `Unsupported AI provider: ${configured}`,
      configured
    );
  }

  // Local development is local-first even when legacy API keys still exist.
  if (process.env.NODE_ENV !== 'production') return 'ollama';

  // Preserve legacy production auto-detection during the migration.
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'ollama';
}

export function getAIProvider(): AIProvider {
  switch (resolveProviderName()) {
    case 'ollama':
      return new OllamaProvider();
    case 'groq':
      return new GroqProvider();
    case 'gemini':
      return new GeminiProvider();
    case 'openai':
      return new OpenAIProvider();
  }
}

function stripJsonFences(content: string): string {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export const ai = {
  async chat(request: AIRequest): Promise<AIResponse> {
    const provider = getAIProvider();
    logger.info('Starting AI chat completion', { provider: provider.name });
    return provider.chat(request);
  },

  stream(request: AIRequest): AsyncGenerator<string> {
    const provider = getAIProvider();
    logger.info('Starting AI chat stream', { provider: provider.name });
    return provider.streamChat(request);
  },

  async chatStructured<T>(request: AIRequest, schema: z.ZodType<T>): Promise<T> {
    const response = await this.chat({ ...request, responseFormat: 'json' });

    let payload: unknown;
    try {
      payload = JSON.parse(stripJsonFences(response.content));
    } catch (error) {
      throw new AIProviderError(
        'INVALID_JSON',
        'AI completion was not valid JSON',
        getAIProvider().name,
        undefined,
        { cause: error }
      );
    }

    const result = schema.safeParse(payload);
    if (!result.success) {
      throw new AIProviderError(
        'INVALID_RESPONSE',
        `AI structured response failed validation: ${result.error.message}`,
        getAIProvider().name
      );
    }
    return result.data;
  },
};

function buildMessages(systemPrompt: string, messages: ChatMessage[]): AIMessage[] {
  return [{ role: 'system', content: withStacklystBasePrompt(systemPrompt) }, ...messages];
}

async function retry<T>(operation: () => Promise<T>, label: string): Promise<T | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await operation();
    } catch (error) {
      logger.warn(`${label} attempt failed`, { attempt, error: String(error) });
    }
  }
  return null;
}

export async function generateChatAI(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string | null> {
  const result = await retry(
    () => ai.chat({ messages: buildMessages(systemPrompt, messages) }),
    'AI chat'
  );
  return result?.content ?? null;
}

export async function* streamChatAI(
  systemPrompt: string,
  messages: ChatMessage[],
  signal?: AbortSignal
): AsyncGenerator<string> {
  yield* ai.stream({ messages: buildMessages(systemPrompt, messages), signal });
}

function normalizeQuizPayload(payload: unknown): unknown {
  let candidate = payload;
  if (Array.isArray(candidate)) candidate = candidate[0];
  if (typeof candidate !== 'object' || candidate === null) return candidate;

  const record = candidate as Record<string, unknown>;
  if (!record.question) {
    const nested = record.questions ?? record.quizzes ?? record.quiz ?? record.data;
    candidate = Array.isArray(nested) ? nested[0] : nested;
  }
  if (typeof candidate !== 'object' || candidate === null) return candidate;

  const normalized = candidate as Record<string, unknown>;
  const options = normalized.options ?? normalized.choices ?? normalized.alternatives;
  const correctIndex =
    normalized.correct_index ??
    normalized.correctIndex ??
    normalized.correct_answer ??
    normalized.correctAnswer;

  return {
    question: normalized.question ?? normalized.prompt ?? normalized.title,
    options: Array.isArray(options)
      ? options.map((option) =>
          typeof option === 'object' && option !== null && 'text' in option
            ? String((option as { text: unknown }).text)
            : String(option)
        )
      : options,
    correct_index:
      typeof correctIndex === 'number' ? correctIndex : Number.parseInt(String(correctIndex), 10),
    explanation: normalized.explanation ?? normalized.description,
    tags: Array.isArray(normalized.tags) ? normalized.tags.map(String) : undefined,
  };
}

export async function generateQuizAI(
  systemPrompt: string,
  userPrompt: string
): Promise<AIQuizResponse | null> {
  return retry(async () => {
    const response = await ai.chat({
      messages: buildMessages(systemPrompt, [{ role: 'user', content: userPrompt }]),
      responseFormat: 'json',
      temperature: 0.3,
    });

    let payload: unknown;
    try {
      payload = JSON.parse(stripJsonFences(response.content));
    } catch (error) {
      throw new AIProviderError(
        'INVALID_JSON',
        'Quiz response was not valid JSON',
        undefined,
        undefined,
        {
          cause: error,
        }
      );
    }
    return AIQuizResponseSchema.parse(normalizeQuizPayload(payload));
  }, 'AI quiz generation');
}
