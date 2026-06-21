import { z } from 'zod';
import { logger } from '@/lib/logger';

export const AIQuizResponseSchema = z.object({
  question: z.string().min(5).max(500),
  options: z.array(z.string().min(1).max(200)).length(4),
  correct_index: z.number().int().min(0).max(3),
  explanation: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type AIQuizResponse = z.infer<typeof AIQuizResponseSchema>;

function getProvider(): 'gemini' | 'groq' | 'openai' | 'ollama' | null {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (
    provider === 'gemini' ||
    provider === 'groq' ||
    provider === 'openai' ||
    provider === 'ollama'
  ) {
    return provider as any;
  }

  // Auto-detect based on API Keys
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENAI_API_KEY) return 'openai';

  return null;
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY não configurada');

  const model = process.env.AI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini retornou conteúdo vazio');
  return JSON.parse(text);
}

async function callGroq(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY não configurada');

  const model = process.env.AI_MODEL || 'llama-3.1-8b-instant';
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq retornou conteúdo vazio');
  return JSON.parse(text);
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada');

  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const apiBase = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
  const url = `${apiBase}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI retornou conteúdo vazio');
  return JSON.parse(text);
}

async function callOllama(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiBase = process.env.OLLAMA_API_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || process.env.AI_MODEL || 'qwen2.5-coder';
  const url = `${apiBase}/api/chat`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      format: 'json',
      stream: false,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.message?.content;
  if (!text) throw new Error('Ollama retornou conteúdo vazio');
  return JSON.parse(text);
}

function normalizeQuizJson(parsed: any): any {
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Retorno da IA não é um objeto JSON válido');
  }

  // Se o retorno for uma lista de quizzes, pega o primeiro item
  if (Array.isArray(parsed)) {
    parsed = parsed[0];
  }

  // Se o retorno tiver os dados encapsulados em chaves comuns (ex: questions, quizzes, quiz)
  if (parsed && !parsed.question) {
    const possibleArray = parsed.questions ?? parsed.quizzes ?? parsed.quiz ?? parsed.data;
    if (Array.isArray(possibleArray)) {
      parsed = possibleArray[0];
    } else if (typeof possibleArray === 'object' && possibleArray !== null) {
      parsed = possibleArray;
    }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Retorno da IA não pôde ser normalizado para um objeto de quiz');
  }

  // Normalize correct index
  let correctIndex: number | undefined = undefined;
  if (typeof parsed.correct_index === 'number') {
    correctIndex = parsed.correct_index;
  } else if (typeof parsed.correctIndex === 'number') {
    correctIndex = parsed.correctIndex;
  } else if (typeof parsed.correct_answer === 'number') {
    correctIndex = parsed.correct_answer;
  } else if (typeof parsed.correctAnswer === 'number') {
    correctIndex = parsed.correctAnswer;
  }

  if (correctIndex === undefined) {
    const rawVal =
      parsed.correct_index ?? parsed.correctIndex ?? parsed.correct_answer ?? parsed.correctAnswer;
    if (rawVal !== undefined) {
      const num = parseInt(String(rawVal), 10);
      if (!isNaN(num)) {
        correctIndex = num;
      }
    }
  }

  // Normalize options array
  let options: any[] = [];
  if (Array.isArray(parsed.options)) {
    options = parsed.options;
  } else if (Array.isArray(parsed.choices)) {
    options = parsed.choices;
  } else if (Array.isArray(parsed.alternatives)) {
    options = parsed.alternatives;
  }

  return {
    question: parsed.question ?? parsed.prompt ?? parsed.title ?? '',
    options: options.map((o) => String(o)),
    correct_index: correctIndex,
    explanation: parsed.explanation ?? parsed.description ?? undefined,
    tags: Array.isArray(parsed.tags) ? parsed.tags.map((t: any) => String(t)) : undefined,
  };
}

export async function generateQuizAI(
  systemPrompt: string,
  userPrompt: string
): Promise<AIQuizResponse | null> {
  const provider = getProvider();
  if (!provider) {
    logger.warn('Nenhum provedor de IA configurado ou chaves ausentes. Retornando nulo.');
    return null;
  }

  logger.info(`Iniciando geração de quiz via IA com o provedor: ${provider}`);

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      let rawJson: any = null;
      if (provider === 'gemini') {
        rawJson = await callGemini(systemPrompt, userPrompt);
      } else if (provider === 'groq') {
        rawJson = await callGroq(systemPrompt, userPrompt);
      } else if (provider === 'openai') {
        rawJson = await callOpenAI(systemPrompt, userPrompt);
      } else if (provider === 'ollama') {
        rawJson = await callOllama(systemPrompt, userPrompt);
      }

      logger.debug(`[AI TRY] Attempt ${attempt} raw response`, { rawJson });
      const normalized = normalizeQuizJson(rawJson);
      return AIQuizResponseSchema.parse(normalized);
    } catch (err) {
      logger.warn(`Falha na tentativa ${attempt} de geração de quiz via ${provider}`, {
        error: String(err),
      });
    }
  }

  return null;
}

async function callGeminiChat(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY não configurada');

  const model = process.env.AI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini Chat error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini retornou conteúdo de chat vazio');
  return text;
}

async function callGroqChat(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY não configurada');

  const model = process.env.AI_MODEL || 'llama-3.1-8b-instant';
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: groqMessages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq Chat error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq retornou conteúdo de chat vazio');
  return text;
}

async function callOpenAIChat(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada');

  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const apiBase = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
  const url = `${apiBase}/chat/completions`;

  const openAiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: openAiMessages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI Chat error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI retornou conteúdo de chat vazio');
  return text;
}

async function callOllamaChat(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const apiBase = process.env.OLLAMA_API_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || process.env.AI_MODEL || 'qwen2.5-coder';
  const url = `${apiBase}/api/chat`;

  const ollamaMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: ollamaMessages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama Chat error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.message?.content;
  if (!text) throw new Error('Ollama retornou conteúdo de chat vazio');
  return text;
}

export async function generateChatAI(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string | null> {
  const provider = getProvider();
  if (!provider) {
    logger.warn('Nenhum provedor de IA configurado ou chaves ausentes para chat. Retornando nulo.');
    return null;
  }

  logger.info(`Iniciando resposta do chat via IA com o provedor: ${provider}`);

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      if (provider === 'gemini') {
        return await callGeminiChat(systemPrompt, messages);
      } else if (provider === 'groq') {
        return await callGroqChat(systemPrompt, messages);
      } else if (provider === 'openai') {
        return await callOpenAIChat(systemPrompt, messages);
      } else if (provider === 'ollama') {
        return await callOllamaChat(systemPrompt, messages);
      }
    } catch (err) {
      logger.warn(`Falha na tentativa ${attempt} de chat via ${provider}`, {
        error: String(err),
      });
    }
  }

  return null;
}
