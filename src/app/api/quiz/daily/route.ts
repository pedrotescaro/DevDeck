import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

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

    // Buscar tentativa do usuário
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        user_id_quiz_id: {
          user_id: user.id,
          quiz_id: quiz.id,
        },
      },
    });

    return NextResponse.json({ quiz, attempt });
  } catch (error) {
    console.error('Error fetching daily quiz:', error);
    return NextResponse.json({ error: 'Erro ao carregar quiz diário' }, { status: 500 });
  }
}
