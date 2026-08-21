import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ai, getPublicAIError, STACKLYST_TUTOR_PROMPT, withStacklystBasePrompt } from '@/lib/ai';
import { apiHandler } from '@/lib/api-handler';
import { logger } from '@/lib/logger';
import { rateLimit } from '@/lib/ratelimit';

const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 12_000;
const MAX_TOTAL_CONTENT_LENGTH = 30_000;
const MAX_BODY_BYTES = 64_000;

const aiChatRequestSchema = z
  .object({
    messages: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
        })
      )
      .min(1)
      .max(MAX_MESSAGES),
  })
  .strict()
  .superRefine(({ messages }, context) => {
    const totalLength = messages.reduce((total, message) => total + message.content.length, 0);
    if (totalLength > MAX_TOTAL_CONTENT_LENGTH) {
      context.addIssue({
        code: 'custom',
        path: ['messages'],
        message: 'O conteúdo total da conversa excede o limite permitido.',
      });
    }
  });

export const POST = apiHandler(async (request, context) => {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: 'PAYLOAD_TOO_LARGE', message: 'A mensagem enviada excede o limite permitido.' },
      { status: 413 }
    );
  }

  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const identifier = context.session?.id ?? forwardedFor ?? 'anonymous';
  await rateLimit(`ai-chat:${identifier}`, {
    limit: 20,
    window: '1 m',
    endpoint: '/api/ai/chat',
  });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'INVALID_JSON', message: 'Envie um corpo JSON válido.' },
      { status: 400 }
    );
  }

  const parsed = aiChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', message: 'As mensagens enviadas são inválidas.' },
      { status: 400 }
    );
  }

  try {
    const response = await ai.chat({
      messages: [
        { role: 'system', content: withStacklystBasePrompt(STACKLYST_TUTOR_PROMPT) },
        ...parsed.data.messages,
      ],
      temperature: 0.3,
      signal: request.signal,
    });

    return NextResponse.json({ message: response.content });
  } catch (error) {
    const publicError = getPublicAIError(error);
    logger.error('AI chat route failed', {
      error: String(error),
      code: publicError.code,
    });
    return NextResponse.json(
      { error: publicError.code, message: publicError.message },
      { status: publicError.status }
    );
  }
});
