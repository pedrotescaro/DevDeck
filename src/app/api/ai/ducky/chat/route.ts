import { apiHandler } from '@/lib/api-handler';
import {
  getPublicAIError,
  STACKLYST_TUTOR_PROMPT,
  streamChatAI,
  type ChatContentPart,
} from '@/lib/ai';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth';
import { rateLimit } from '@/lib/ratelimit';
import {
  AI_CHAT_HISTORY_MESSAGES,
  AI_CHAT_MESSAGE_CHARACTERS,
  RATE_LIMIT_AI_CHAT,
  RATE_LIMIT_AI_GLOBAL,
} from '@/lib/config';
import { z } from 'zod';

const contentPartSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string().max(12_000) }),
  z.object({
    type: z.literal('image'),
    mimeType: z.string().max(100),
    data: z.string().max(8_000_000),
  }),
]);

const duckyChatSchema = z.object({
  language: z.string().min(1).max(50),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model', 'assistant', 'ducky']),
        content: z.union([z.string().max(12_000), z.array(contentPartSchema).max(10)]),
      })
    )
    .min(1)
    .max(30),
});

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException) return error.name === 'AbortError';
  if (error instanceof Error && 'code' in error) return error.code === 'ABORTED';
  return (error as { name?: string } | null)?.name === 'AbortError';
}

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();
  await rateLimit(`ai-assistant:${user.id}`, {
    ...RATE_LIMIT_AI_CHAT,
    endpoint: '/api/ai/ducky/chat',
  });
  await rateLimit('ai-assistant:global', {
    ...RATE_LIMIT_AI_GLOBAL,
    endpoint: '/api/ai/ducky/chat',
  });

  const body = await req.json();
  const { language, history } = duckyChatSchema.parse(body);

  const systemPrompt = `${STACKLYST_TUTOR_PROMPT}

Você é a ASYNC, a copiloto de programação oficial do Stacklyst.
Seu papel é ajudar o desenvolvedor a estruturar pensamentos, depurar código com bugs e consolidar conceitos com precisão técnica.

Diretrizes de comportamento:
1. Mantenha um tom moderno, encorajador, inteligente e técnico em português do Brasil.
2. Se o desenvolvedor descrever um problema ou erro, faça perguntas investigativas que o incentivem a verbalizar a lógica do próprio código, ajudando-o a descobrir o bug. Quando necessário, forneça insights técnicos detalhados e sugestões de correção.
3. Adapte suas explicações, sintaxe e exemplos de código para a trilha ativa do desenvolvedor, que atualmente é de **${language}**.
4. Formate suas mensagens usando Markdown limpo com syntax highlighting para blocos de código.
5. Quando o usuário anexar arquivos de código, leia e considere o conteúdo anexado na sua resposta. Quando anexar imagens (screenshots de erros, UI, etc), descreva e analise o que vê.
6. Nunca saia do personagem. Você é a ASYNC, não um modelo de linguagem genérico.`;

  // Mapear o histórico para os papéis aceitos ('user' / 'assistant'), preservando
  // conteúdo multimodal (texto + imagens).
  const mappedHistory = history.slice(-AI_CHAT_HISTORY_MESSAGES).map((h) => {
    const role = (h.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant';
    const content: string | ChatContentPart[] =
      typeof h.content === 'string'
        ? h.content.slice(0, AI_CHAT_MESSAGE_CHARACTERS)
        : (h.content.map((part) =>
            part.type === 'text'
              ? { ...part, text: part.text.slice(0, AI_CHAT_MESSAGE_CHARACTERS) }
              : part
          ) as ChatContentPart[]);
    return { role, content };
  });

  const encoder = new TextEncoder();
  const abortController = new AbortController();
  req.signal?.addEventListener('abort', () => abortController.abort(), { once: true });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        let hasChunk = false;
        for await (const chunk of streamChatAI(
          systemPrompt,
          mappedHistory,
          abortController.signal
        )) {
          hasChunk = true;
          send({ text: chunk });
        }
        if (!hasChunk) {
          send({
            error:
              'Estou com dificuldades para me conectar agora. Pode tentar novamente em instantes?',
          });
        }
      } catch (err) {
        if (isAbortError(err)) return; // client disconnected / stopped
        logger.error('Ducky chat stream error:', {
          error: String(err),
          stack: (err as Error)?.stack,
        });
        const publicError = getPublicAIError(err);
        send({ error: publicError.message, code: publicError.code });
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
    cancel() {
      abortController.abort();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
});
