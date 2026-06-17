import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { quizAttemptSchema } from "@/lib/validators";
import { awardXP } from "@/lib/xp";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: quizId } = await params;

    // Buscar o quiz e o post para pegar o idioma
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        post: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    // Verificar se o usuário já tentou responder a esse quiz
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        user_id_quiz_id: {
          user_id: user.id,
          quiz_id: quizId,
        },
      },
    });

    if (existingAttempt) {
      return NextResponse.json({ error: "Você já respondeu a este quiz" }, { status: 400 });
    }

    const body = await request.json();
    const result = quizAttemptSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { selected_index } = result.data;
    const isCorrect = selected_index === quiz.correct_index;
    const xpAmount = isCorrect ? 15 : 0;

    // Registrar tentativa de quiz
    const attempt = await prisma.quizAttempt.create({
      data: {
        user_id: user.id,
        quiz_id: quizId,
        selected_index,
        is_correct: isCorrect,
        xp_earned: xpAmount,
      },
    });

    // Se estiver correto, conceder XP (+15 XP por acerto)
    let xpResult = null;
    if (isCorrect) {
      const language = quiz.post ? quiz.post.language : null;
      xpResult = await awardXP(user.id, language, xpAmount);
    }

    return NextResponse.json({
      attempt,
      correct_index: quiz.correct_index,
      is_correct: isCorrect,
      xpResult,
    });
  } catch (error) {
    console.error("Error attempting quiz:", error);
    return NextResponse.json({ error: "Erro ao tentar responder o quiz" }, { status: 500 });
  }
}
