import { apiHandler } from '@/lib/api-handler';
import { streamChatAI, type ChatContentPart } from '@/lib/ai';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const contentPartSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({
    type: z.literal('image'),
    mimeType: z.string(),
    data: z.string(),
  }),
]);

const duckyChatSchema = z.object({
  language: z.string(),
  history: z.array(
    z.object({
      role: z.enum(['user', 'model', 'assistant', 'ducky']),
      content: z.union([z.string(), z.array(contentPartSchema)]),
    })
  ),
});

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException) return error.name === 'AbortError';
  return (error as { name?: string } | null)?.name === 'AbortError';
}

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const { language, history } = duckyChatSchema.parse(body);

  const systemPrompt = `Você é a ASYNC, a copiloto de programação oficial do Stacklyst.
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
  const mappedHistory = history.map((h) => {
    const role = (h.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant';
    const content: string | ChatContentPart[] =
      typeof h.content === 'string' ? h.content : (h.content as ChatContentPart[]);
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
        const errMsg = err instanceof Error ? err.message : String(err);
        send({ error: `Tive um problema ao me conectar com os servidores de IA: ${errMsg}` });
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
