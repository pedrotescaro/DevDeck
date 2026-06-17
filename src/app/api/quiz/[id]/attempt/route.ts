import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { quizAttemptSchema } from "@/lib/validators";
import { awardXP } from "@/lib/xp";
import { findTrailQuestionById } from "@/lib/trailsData";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: quizId } = await params;

    // Buscar o quiz e o post para pegar o idioma
    let quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        post: true,
      },
    });

    let correctIndex = 0;
    let language: string | null = null;

    if (!quiz) {
      // Verificar se é um quiz de trilha (duolingo-like)
      const trailInfo = findTrailQuestionById(quizId);
      if (!trailInfo) {
        return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
      }

      // Registrar dinamicamente no banco para respeitar a integridade referencial
      quiz = await prisma.quiz.create({
        data: {
          id: quizId,
          question: trailInfo.question.question,
          options: trailInfo.question.options,
          correct_index: trailInfo.question.correctIndex,
          is_daily: false,
        },
        include: {
          post: true,
        },
      });

      correctIndex = trailInfo.question.correctIndex;
      language = trailInfo.language;
    } else {
      correctIndex = quiz.correct_index;
      language = quiz.post ? quiz.post.language : null;
    }

    // Verificar se o usuário já tentou responder a esse quiz
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        user_id_quiz_id: {
          user_id: user.id,
          quiz_id: quiz.id,
        },
      },
    });

    const body = await request.json();
    const result = quizAttemptSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { selected_index } = result.data;
    const isCorrect = selected_index === correctIndex;

    let attempt;
    let xpAmount = 0;
    let xpResult = null;

    if (existingAttempt) {
      // Se já respondeu correto antes, não ganha XP novamente
      if (existingAttempt.is_correct) {
        attempt = await prisma.quizAttempt.update({
          where: { id: existingAttempt.id },
          data: { selected_index },
        });
      } else {
        // Se errou antes e agora acertou, ganha os 15 XP
        xpAmount = isCorrect ? 15 : 0;
        attempt = await prisma.quizAttempt.update({
          where: { id: existingAttempt.id },
          data: {
            selected_index,
            is_correct: isCorrect,
            xp_earned: xpAmount,
          },
        });
        if (isCorrect) {
          xpResult = await awardXP(user.id, language as any, xpAmount);
        }
      }
    } else {
      // Primeira tentativa
      xpAmount = isCorrect ? 15 : 0;
      attempt = await prisma.quizAttempt.create({
        data: {
          user_id: user.id,
          quiz_id: quiz.id,
          selected_index,
          is_correct: isCorrect,
          xp_earned: xpAmount,
        },
      });
      if (isCorrect) {
        xpResult = await awardXP(user.id, language as any, xpAmount);
      }
    }

    let formattedXpResult = null;
    if (xpResult) {
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { total_xp: true }
      });
      formattedXpResult = {
        newTotalXp: updatedUser?.total_xp ?? user.total_xp,
        newLanguageXp: xpResult.newXp,
        newLanguageLevel: xpResult.newLevel,
      };
    }

    return NextResponse.json({
      attempt,
      correct_index: quiz.correct_index,
      is_correct: isCorrect,
      xpResult: formattedXpResult,
    });
  } catch (error) {
    console.error("Error attempting quiz:", error);
    return NextResponse.json({ error: "Erro ao tentar responder o quiz" }, { status: 500 });
  }
}
