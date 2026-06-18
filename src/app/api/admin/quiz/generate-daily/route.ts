import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { ForbiddenError } from '@/lib/errors';
import { QuizService } from '@/services/quiz.service';

export const POST = apiHandler(async (req) => {
  const authHeader = req.headers.get('Authorization');
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    throw new ForbiddenError('UNAUTHORIZED_CRON', 'Chave CRON inválida');
  }

  const body = await req.json().catch(() => ({}));
  const dateStr = body.scheduled_for;
  const scheduledFor = dateStr ? new Date(dateStr) : new Date();

  const quiz = await QuizService.generateDaily(scheduledFor);

  return NextResponse.json({ success: true, quiz });
});
