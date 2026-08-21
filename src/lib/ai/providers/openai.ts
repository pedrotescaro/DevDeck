import { OpenAICompatibleProvider } from './openai-compatible';

export class OpenAIProvider extends OpenAICompatibleProvider {
  constructor() {
    super({
      name: 'openai',
      getUrl: () => {
        const baseUrl = process.env.OPENAI_API_BASE_URL?.trim() || 'https://api.openai.com/v1';
        return `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
      },
      getModel: () =>
        process.env.OPENAI_AI_MODEL?.trim() || process.env.AI_MODEL?.trim() || 'gpt-4o-mini',
      getApiKey: () => process.env.OPENAI_API_KEY?.trim(),
      timeoutMs: () => 30_000,
      supportsImages: true,
    });
  }
}
