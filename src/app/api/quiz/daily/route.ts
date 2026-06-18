import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const GET = apiHandler(async (req) => {
  const user = await requireAuth();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let quiz = await prisma.quiz.findUnique({
    where: { scheduled_for: today },
  });

  if (!quiz) {
    quiz = await prisma.quiz.findFirst({
      where: { is_daily: true },
      orderBy: { created_at: 'desc' },
    });
  }

  if (!quiz) {
    return NextResponse.json({ quiz: null, attempt: null });
  }

  // Get user attempt
  const attempt = await prisma.quizAttempt.findUnique({
    where: {
      user_id_quiz_id: {
        user_id: user.id,
        quiz_id: quiz.id,
      },
    },
  });

  return NextResponse.json({ quiz, attempt });
});
