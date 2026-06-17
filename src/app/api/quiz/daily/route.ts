import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar todos os quizzes diários do sistema
    const dailyQuizzes = await prisma.quiz.findMany({
      where: { is_daily: true, post_id: null },
    });

    if (dailyQuizzes.length === 0) {
      return NextResponse.json({ quiz: null, attempt: null });
    }

    // Obter quiz determinístico para o dia do ano
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const quizIndex = dayOfYear % dailyQuizzes.length;
    const quiz = dailyQuizzes[quizIndex];

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
    console.error("Error fetching daily quiz:", error);
    return NextResponse.json({ error: "Erro ao carregar quiz diário" }, { status: 500 });
  }
}
