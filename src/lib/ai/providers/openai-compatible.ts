import { AIProviderError } from '../errors';
import type { AIProvider, AIRequest, AIResponse } from '../types';
import {
  createAbortContext,
  handleFetchError,
  readChatContent,
  readErrorBody,
  readStreamDelta,
  toOpenAIMessage,
} from './shared';

interface OpenAICompatibleConfig {
  name: string;
  getUrl: () => string;
  getModel: () => string;
  getApiKey?: () => string | undefined;
  timeoutMs: () => number;
  supportsImages?: boolean;
  getExtraBody?: () => Record<string, unknown>;
  mapHttpError?: (status: number, body: string) => AIProviderError;
}

export class OpenAICompatibleProvider implements AIProvider {
  readonly name: string;

  constructor(private readonly config: OpenAICompatibleConfig) {
    this.name = config.name;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.config.getApiKey) {
      const apiKey = this.config.getApiKey();
      if (!apiKey) {
        throw new AIProviderError(
          'PROVIDER_NOT_CONFIGURED',
          `${this.name} API key is not configured`,
          this.name
        );
      }
      headers.Authorization = `Bearer ${apiKey}`;
    }
    return headers;
  }

  private buildBody(request: AIRequest, stream: boolean): string {
    return JSON.stringify({
      ...this.config.getExtraBody?.(),
      model: this.config.getModel(),
      messages: request.messages.map((message) =>
        toOpenAIMessage(message, this.config.supportsImages ?? false)
      ),
      temperature: request.temperature,
      response_format: request.responseFormat === 'json' ? { type: 'json_object' } : undefined,
      stream,
    });
  }

  private async assertResponse(response: Response): Promise<void> {
    if (response.ok) return;
    const body = await readErrorBody(response);
    if (this.config.mapHttpError) {
      throw this.config.mapHttpError(response.status, body);
    }
    throw new AIProviderError(
      'HTTP_ERROR',
      `${this.name} returned HTTP ${response.status}: ${body}`,
      this.name,
      response.status
    );
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    const abortContext = createAbortContext(request.signal, this.config.timeoutMs());

    try {
      let response: Response;
      try {
        response = await fetch(this.config.getUrl(), {
          method: 'POST',
          headers: this.getHeaders(),
          body: this.buildBody(request, false),
          signal: abortContext.signal,
        });
      } catch (error) {
        handleFetchError(error, this.name, abortContext);
      }

      await this.assertResponse(response);

      let payload: unknown;
      try {
        payload = await response.json();
      } catch (error) {
        throw new AIProviderError(
          'INVALID_JSON',
          `${this.name} returned invalid JSON`,
          this.name,
          response.status,
          { cause: error }
        );
      }

      const content = readChatContent(payload);
      if (!content) {
        throw new AIProviderError(
          'EMPTY_RESPONSE',
          `${this.name} returned an empty completion`,
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
    const abortContext = createAbortContext(request.signal, this.config.timeoutMs());

    try {
      let response: Response;
      try {
        response = await fetch(this.config.getUrl(), {
          method: 'POST',
          headers: this.getHeaders(),
          body: this.buildBody(request, true),
          signal: abortContext.signal,
        });
      } catch (error) {
        handleFetchError(error, this.name, abortContext);
      }

      await this.assertResponse(response);
      const reader = response.body?.getReader();
      if (!reader) {
        throw new AIProviderError(
          'INVALID_RESPONSE',
          `${this.name} returned no stream body`,
          this.name,
          response.status
        );
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let hasContent = false;

      try {
        while (true) {
          let result: ReadableStreamReadResult<Uint8Array>;
          try {
            result = await reader.read();
          } catch (error) {
            handleFetchError(error, this.name, abortContext);
          }
          if (result.done) break;

          buffer += decoder.decode(result.value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const rawPayload = trimmed.slice(5).trim();
            if (!rawPayload || rawPayload === '[DONE]') continue;

            let payload: unknown;
            try {
              payload = JSON.parse(rawPayload);
            } catch (error) {
              throw new AIProviderError(
                'INVALID_JSON',
                `${this.name} returned invalid stream JSON`,
                this.name,
                response.status,
                { cause: error }
              );
            }

            const chunk = readStreamDelta(payload);
            if (chunk) {
              hasContent = true;
              yield chunk;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      if (!hasContent) {
        throw new AIProviderError(
          'EMPTY_RESPONSE',
          `${this.name} returned an empty stream`,
          this.name,
          response.status
        );
      }
    } finally {
      abortContext.cleanup();
    }
  }
}
