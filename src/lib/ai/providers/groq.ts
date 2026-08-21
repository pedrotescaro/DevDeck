import { OpenAICompatibleProvider } from './openai-compatible';

export class GroqProvider extends OpenAICompatibleProvider {
  constructor() {
    super({
      name: 'groq',
      getUrl: () => 'https://api.groq.com/openai/v1/chat/completions',
      getModel: () =>
        process.env.GROQ_AI_MODEL?.trim() ||
        process.env.AI_MODEL?.trim() ||
        'llama-3.3-70b-versatile',
      getApiKey: () => process.env.GROQ_API_KEY?.trim(),
      timeoutMs: () => 30_000,
    });
  }
}
