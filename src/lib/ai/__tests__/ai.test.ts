import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ai,
  AIProviderError,
  getAIProvider,
  getPublicAIError,
  STACKLYST_SYSTEM_PROMPT,
} from '@/lib/ai';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('ASYNC providers', () => {
  it('instructs ASYNC to avoid emojis by default', () => {
    expect(STACKLYST_SYSTEM_PROMPT).toContain('por padrão, não use emojis');
    expect(STACKLYST_SYSTEM_PROMPT).toContain('Use no máximo um emoji');
  });

  it('defaults to Ollama in development even when a legacy API key exists', () => {
    vi.stubEnv('AI_PROVIDER', '');
    vi.stubEnv('GROQ_API_KEY', 'legacy-key');
    expect(getAIProvider().name).toBe('ollama');
  });

  it('uses Ollama by default and sends the server-owned URL and model', async () => {
    vi.stubEnv('AI_PROVIDER', 'ollama');
    vi.stubEnv('STACKLYST_AI_URL', 'http://127.0.0.1:11434/');
    vi.stubEnv('STACKLYST_AI_MODEL', 'async');
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ choices: [{ message: { content: 'Uma closure mantém o escopo.' } }] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );
    vi.stubGlobal('fetch', fetchMock);

    const response = await ai.chat({
      messages: [{ role: 'user', content: 'Explique closures.' }],
    });

    expect(response.content).toBe('Uma closure mantém o escopo.');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:11434/v1/chat/completions',
      expect.objectContaining({ method: 'POST' })
    );

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(request.body)) as {
      model: string;
      reasoning_effort: string;
      messages: Array<{ role: string; content: string }>;
    };
    expect(body.model).toBe('async');
    expect(body.reasoning_effort).toBe('none');
    expect(body.messages).toEqual([{ role: 'user', content: 'Explique closures.' }]);
  });

  it('keeps Groq interchangeable behind the same interface', async () => {
    vi.stubEnv('AI_PROVIDER', 'groq');
    vi.stubEnv('GROQ_API_KEY', 'test-key');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'Resposta Groq' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await ai.chat({
      messages: [{ role: 'user', content: 'Olá' }],
    });

    expect(response.content).toBe('Resposta Groq');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
      })
    );
  });

  it('classifies a missing Ollama model without exposing upstream details publicly', async () => {
    vi.stubEnv('AI_PROVIDER', 'ollama');
    vi.stubEnv('STACKLYST_AI_URL', 'http://127.0.0.1:11434');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('model async not found', { status: 404 }))
    );

    let caught: unknown;
    try {
      await ai.chat({ messages: [{ role: 'user', content: 'Olá' }] });
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(AIProviderError);
    expect((caught as AIProviderError).code).toBe('MODEL_NOT_FOUND');
    expect(getPublicAIError(caught)).toEqual({
      code: 'AI_MODEL_UNAVAILABLE',
      message: 'O modelo da ASYNC ainda não está disponível no servidor.',
      status: 503,
    });
  });

  it('rejects unknown providers before making a network request', () => {
    vi.stubEnv('AI_PROVIDER', 'unknown-provider');
    expect(() => getAIProvider()).toThrowError(AIProviderError);
  });

  it('rejects invalid JSON returned by a provider', async () => {
    vi.stubEnv('AI_PROVIDER', 'ollama');
    vi.stubEnv('STACKLYST_AI_URL', 'http://127.0.0.1:11434');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('not-json', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    await expect(ai.chat({ messages: [{ role: 'user', content: 'Olá' }] })).rejects.toMatchObject({
      code: 'INVALID_JSON',
    });
  });
});
