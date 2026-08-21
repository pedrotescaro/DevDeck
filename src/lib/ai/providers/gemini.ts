import { AIProviderError } from '../errors';
import type { AIProvider, AIRequest, AIResponse } from '../types';
import {
  contentToText,
  createAbortContext,
  handleFetchError,
  isRecord,
  readErrorBody,
} from './shared';

function getGeminiContent(payload: unknown): string | null {
  if (!isRecord(payload) || !Array.isArray(payload.candidates)) return null;
  const candidate = payload.candidates[0];
  if (!isRecord(candidate) || !isRecord(candidate.content)) return null;
  const parts = candidate.content.parts;
  if (!Array.isArray(parts)) return null;

  const text = parts
    .map((part) => (isRecord(part) && typeof part.text === 'string' ? part.text : ''))
    .join('')
    .trim();
  return text || null;
}

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';

  private getUrl(): string {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new AIProviderError(
        'PROVIDER_NOT_CONFIGURED',
        'Gemini API key is not configured',
        this.name
      );
    }
    const model =
      process.env.GEMINI_AI_MODEL?.trim() || process.env.AI_MODEL?.trim() || 'gemini-1.5-flash';
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    const abortContext = createAbortContext(request.signal, 30_000);
    const systemPrompt = request.messages
      .filter((message) => message.role === 'system')
      .map((message) => contentToText(message.content))
      .join('\n\n');
    const messages = request.messages.filter((message) => message.role !== 'system');

    try {
      let response: Response;
      try {
        response = await fetch(this.getUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: messages.map((message) => ({
              role: message.role === 'assistant' ? 'model' : 'user',
              parts:
                typeof message.content === 'string'
                  ? [{ text: message.content }]
                  : message.content.map((part) =>
                      part.type === 'text'
                        ? { text: part.text }
                        : { inlineData: { mimeType: part.mimeType, data: part.data } }
                    ),
            })),
            systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
            generationConfig: {
              temperature: request.temperature,
              responseMimeType:
                request.responseFormat === 'json' ? 'application/json' : 'text/plain',
            },
          }),
          signal: abortContext.signal,
        });
      } catch (error) {
        handleFetchError(error, this.name, abortContext);
      }

      if (!response.ok) {
        const body = await readErrorBody(response);
        throw new AIProviderError(
          'HTTP_ERROR',
          `Gemini returned HTTP ${response.status}: ${body}`,
          this.name,
          response.status
        );
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch (error) {
        throw new AIProviderError(
          'INVALID_JSON',
          'Gemini returned invalid JSON',
          this.name,
          response.status,
          { cause: error }
        );
      }

      const content = getGeminiContent(payload);
      if (!content) {
        throw new AIProviderError(
          'EMPTY_RESPONSE',
          'Gemini returned an empty completion',
          this.name,
          response.status
        );
      }
      return { content };
    } finally {
      abortContext.cleanup();
    }
  }

  async *streamChat(request: AIRequest): AsyncGenerator<string> {
    // The legacy Gemini integration did not stream natively. Keep its existing
    // behavior behind the same provider contract until a streaming endpoint is needed.
    const response = await this.chat(request);
    yield response.content;
  }
}
