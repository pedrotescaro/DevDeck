import { prisma } from "@/lib/prisma";
import { Language } from "@prisma/client";

// Mapeamento de níveis baseado nas faixas de XP do seed do banco de dados
export function calculateLevel(xp: number): { level: number; nextLevelXp: number; prevLevelXp: number } {
  if (xp < 500) return { level: 1, nextLevelXp: 500, prevLevelXp: 0 };
  if (xp < 800) return { level: 2, nextLevelXp: 800, prevLevelXp: 500 };
  if (xp < 1100) return { level: 3, nextLevelXp: 1100, prevLevelXp: 800 };
  if (xp < 1500) return { level: 4, nextLevelXp: 1500, prevLevelXp: 1100 };
  if (xp < 2000) return { level: 5, nextLevelXp: 2000, prevLevelXp: 1500 };

  // Níveis acima do 6 incrementam com passos crescentes
  let level = 6;
  let currentThreshold = 2000;
  let nextIncrement = 600;

  while (xp >= currentThreshold + nextIncrement) {
    currentThreshold += nextIncrement;
    level++;
    nextIncrement += 100;
  }

  return {
    level,
    nextLevelXp: currentThreshold + nextIncrement,
    prevLevelXp: currentThreshold,
  };
}

// Função para conceder XP e atualizar dados de gamificação
export async function awardXP(userId: string, language: Language | null | undefined, amount: number) {
  if (!language) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        total_xp: {
          increment: amount,
        },
      },
    });
    return {
      xpEarned: amount,
      language: null,
      newXp: updatedUser.total_xp,
      newLevel: calculateLevel(updatedUser.total_xp).level,
      newStreak: 0,
    };
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Atualizar o total_xp do usuário
    await tx.user.update({
      where: { id: userId },
      data: {
        total_xp: {
          increment: amount,
        },
      },
    });

    // 2. Buscar ou criar a trilha da linguagem
    const trail = await tx.languageTrail.findUnique({
      where: {
        user_id_language: { user_id: userId, language },
      },
    });

    const now = new Date();
    let newXp = amount;
    let newLevel = 1;
    let newStreak = 1;

    if (trail) {
      newXp = trail.xp + amount;
      newLevel = calculateLevel(newXp).level;

      // Calcular Streak
      if (trail.last_activity_at) {
        const lastActivity = new Date(trail.last_activity_at);
        
        // Formatar datas para comparação sem horas
        const lastDate = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          // Já fez atividade hoje, mantém a sequência
          newStreak = trail.streak;
        } else if (diffDays === 1) {
          // Atividade consecutiva no dia seguinte, incrementa
          newStreak = trail.streak + 1;
        } else {
          // Sequência quebrada, reinicia em 1
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      // Atualizar trilha existente
      await tx.languageTrail.update({
        where: { id: trail.id },
        data: {
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          last_activity_at: now,
        },
      });
    } else {
      // Criar nova trilha
      newLevel = calculateLevel(newXp).level;
      await tx.languageTrail.create({
        data: {
          user_id: userId,
          language,
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          last_activity_at: now,
        },
      });
    }

    // 3. Checar elegibilidade de badges
    await checkBadgeEligibility(tx, userId, newStreak);

    return {
      xpEarned: amount,
      language,
      newXp,
      newLevel,
      newStreak,
    };
  });
}

// Verifica e concede badges
async function checkBadgeEligibility(tx: any, userId: string, currentStreak: number) {
  // Buscar todas as conquistas do usuário
  const userBadges = await tx.userBadge.findMany({
    where: { user_id: userId },
    include: { badge: true },
  });

  const earnedSlugs = new Set<string>(userBadges.map((ub: any) => ub.badge.slug));

  const badgesToAward: string[] = [];

  // 1. Badge: Streak de 7 dias
  if (currentStreak >= 7 && !earnedSlugs.has("streak_7")) {
    badgesToAward.push("streak_7");
  }

  // 2. Badge: Streak de 30 dias
  if (currentStreak >= 30 && !earnedSlugs.has("streak_30")) {
    badgesToAward.push("streak_30");
  }

  // 3. Badge: Primeira Resposta (primeira resposta no fórum)
  if (!earnedSlugs.has("first_answer")) {
    const answerCount = await tx.answer.count({
      where: { author_id: userId },
    });
    if (answerCount > 0) {
      badgesToAward.push("first_answer");
    }
  }

  // 4. Badge: 5 Respostas Aceitas
  if (!earnedSlugs.has("accepted_5")) {
    const acceptedCount = await tx.answer.count({
      where: { author_id: userId, is_accepted: true },
    });
    if (acceptedCount >= 5) {
      badgesToAward.push("accepted_5");
    }
  }

  // 5. Badge: Quiz Master (5 acertos em quizzes)
  if (!earnedSlugs.has("quiz_master")) {
    const correctAttempts = await tx.quizAttempt.count({
      where: { user_id: userId, is_correct: true },
    });
    if (correctAttempts >= 5) {
      badgesToAward.push("quiz_master");
    }
  }

  // Conceder os badges elegíveis
  for (const slug of badgesToAward) {
    const badge = await tx.badge.findUnique({
      where: { slug },
    });

    if (badge) {
      await tx.userBadge.create({
        data: {
          user_id: userId,
          badge_id: badge.id,
        },
      });
    }
  }
}
