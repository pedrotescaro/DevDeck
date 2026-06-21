import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { XpService } from '@/services/xp.service';
import { z } from 'zod';

const checkpointSchema = z.object({
  checkpointId: z.string(),
  language: z.string(),
  unitNumber: z.number().int().min(1).max(3),
});

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();

  const body = await req.json();
  const { checkpointId, language, unitNumber } = checkpointSchema.parse(body);

  // Garante que o registro do Quiz correspondente ao Checkpoint existe na base
  let quiz = await prisma.quiz.findUnique({
    where: { id: checkpointId },
  });

  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: {
        id: checkpointId,
        question: `Checkpoint de ${language} - Unidade ${unitNumber}`,
        options: ['Concluído'],
        correct_index: 0,
        is_daily: false,
      },
    });
  }

  // Verifica se já existe a tentativa registrada
  const existingAttempt = await prisma.quizAttempt.findUnique({
    where: {
      user_id_quiz_id: {
        user_id: user.id,
        quiz_id: checkpointId,
      },
    },
  });

  let xpResult = null;
  const xpAwarded = 50; // Checkpoint concede mais XP (recompensa por concluir a unidade)

  if (!existingAttempt) {
    // Registra a tentativa com sucesso
    await prisma.quizAttempt.create({
      data: {
        user_id: user.id,
        quiz_id: checkpointId,
        selected_index: 0,
        is_correct: true,
        xp_earned: xpAwarded,
      },
    });

    // Concede o XP para o usuário e para a trilha da linguagem correspondente
    xpResult = await XpService.awardXP(user.id, language as any, xpAwarded);
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { total_xp: true },
  });

  const formattedXpResult = xpResult
    ? {
        newTotalXp: updatedUser?.total_xp ?? user.total_xp,
        newLanguageXp: xpResult.newXp,
        newLanguageLevel: xpResult.newLevel,
      }
    : null;

  return NextResponse.json({
    ok: true,
    xpResult: formattedXpResult,
    xpEarned: !existingAttempt ? xpAwarded : 0,
  });
});
