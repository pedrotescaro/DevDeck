import { prisma } from '@/lib/prisma';
import { Language } from '@prisma/client';
import { logger } from '@/lib/logger';
import { NotificationService } from './notification.service';

export function calculateLevel(xp: number): {
  level: number;
  nextLevelXp: number;
  prevLevelXp: number;
} {
  if (xp < 500) return { level: 1, nextLevelXp: 500, prevLevelXp: 0 };
  if (xp < 800) return { level: 2, nextLevelXp: 800, prevLevelXp: 500 };
  if (xp < 1100) return { level: 3, nextLevelXp: 1100, prevLevelXp: 800 };
  if (xp < 1500) return { level: 4, nextLevelXp: 1500, prevLevelXp: 1100 };
  if (xp < 2000) return { level: 5, nextLevelXp: 2000, prevLevelXp: 1500 };

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

export const XpService = {
  async awardXP(userId: string, language: Language | null | undefined, amount: number) {
    const userBefore = await prisma.user.findUnique({
      where: { id: userId },
      select: { total_xp: true, streak_days: true, last_active_at: true },
    });
    const oldUserLevel = calculateLevel(userBefore?.total_xp ?? 0).level;

    if (!language) {
      const now = new Date();
      let newStreakDays = 1;

      if (userBefore?.last_active_at) {
        const lastActive = new Date(userBefore.last_active_at);
        const lastDate = new Date(
          lastActive.getFullYear(),
          lastActive.getMonth(),
          lastActive.getDate()
        );
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          newStreakDays = userBefore.streak_days;
        } else if (diffDays === 1) {
          newStreakDays = userBefore.streak_days + 1;
        } else {
          newStreakDays = 1;
        }
      } else {
        newStreakDays = 1;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          total_xp: {
            increment: amount,
          },
          streak_days: newStreakDays,
          last_active_at: now,
        },
      });

      const newUserLevel = calculateLevel(updatedUser.total_xp).level;
      if (newUserLevel > oldUserLevel) {
        try {
          await NotificationService.create({
            userId,
            type: 'LEVEL_UP',
            title: `Subiu de Nível! 🎉`,
            content: `Parabéns! Você alcançou o nível ${newUserLevel} no DevDeck!`,
            link: `/profile`,
          });
          logger.info('Level up notification triggered', {
            userId,
            oldLevel: oldUserLevel,
            newLevel: newUserLevel,
          });
        } catch (err) {
          logger.error('Failed to create level up notification', { error: String(err) });
        }
      }

      logger.info('XP awarded generally', { userId, amount, totalXp: updatedUser.total_xp });

      return {
        xpEarned: amount,
        language: null,
        newXp: updatedUser.total_xp,
        newLevel: newUserLevel,
        newStreak: newStreakDays,
      };
    }

    return await prisma.$transaction(async (tx) => {
      // Fetch user stats inside transaction to be safe and accurate
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { streak_days: true, last_active_at: true },
      });

      const now = new Date();
      let newStreakDays = 1;

      if (user?.last_active_at) {
        const lastActive = new Date(user.last_active_at);
        const lastDate = new Date(
          lastActive.getFullYear(),
          lastActive.getMonth(),
          lastActive.getDate()
        );
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          newStreakDays = user.streak_days;
        } else if (diffDays === 1) {
          newStreakDays = user.streak_days + 1;
        } else {
          newStreakDays = 1;
        }
      } else {
        newStreakDays = 1;
      }

      // 1. Update user total XP, streak_days, last_active_at
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          total_xp: {
            increment: amount,
          },
          streak_days: newStreakDays,
          last_active_at: now,
        },
      });

      // 2. Fetch or create language trail
      const trail = await tx.languageTrail.findUnique({
        where: {
          user_id_language: { user_id: userId, language },
        },
      });

      let newXp = amount;
      let newLevel = 1;
      let newStreak = 1;
      let oldTrailLevel = 0;

      if (trail) {
        oldTrailLevel = trail.level;
        newXp = trail.xp + amount;
        newLevel = calculateLevel(newXp).level;

        // Calculate Streak
        if (trail.last_activity_at) {
          const lastActivity = new Date(trail.last_activity_at);
          const lastDate = new Date(
            lastActivity.getFullYear(),
            lastActivity.getMonth(),
            lastActivity.getDate()
          );
          const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

          const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            newStreak = trail.streak;
          } else if (diffDays === 1) {
            newStreak = trail.streak + 1;
          } else {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

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

      // Check badge eligibility using the higher of the streaks (trail vs global user streak)
      await checkBadgeEligibility(tx, userId, Math.max(newStreak, newStreakDays));

      // Trigger notifications for level ups
      const newUserLevel = calculateLevel(updatedUser.total_xp).level;
      if (newUserLevel > oldUserLevel) {
        await tx.notification.create({
          data: {
            userId,
            type: 'LEVEL_UP',
            read: false,
            createdAt: now,
          },
        });
      }

      if (trail && newLevel > oldTrailLevel) {
        await tx.notification.create({
          data: {
            userId,
            type: 'XP_MILESTONE',
            read: false,
            createdAt: now,
          },
        });
      }

      logger.info('XP awarded for language trail', {
        userId,
        language,
        amount,
        trailXp: newXp,
        trailLevel: newLevel,
        streak: newStreak,
      });

      return {
        xpEarned: amount,
        language,
        newXp,
        newLevel,
        newStreak,
      };
    });
  },
};

async function checkBadgeEligibility(tx: any, userId: string, currentStreak: number) {
  const userBadges = await tx.userBadge.findMany({
    where: { user_id: userId },
    include: { badge: true },
  });

  const earnedSlugs = new Set<string>(userBadges.map((ub: any) => ub.badge.slug));
  const badgesToAward: string[] = [];

  if (currentStreak >= 7 && !earnedSlugs.has('streak_7')) {
    badgesToAward.push('streak_7');
  }
  if (currentStreak >= 30 && !earnedSlugs.has('streak_30')) {
    badgesToAward.push('streak_30');
  }

  if (!earnedSlugs.has('first_answer')) {
    const answerCount = await tx.answer.count({
      where: { author_id: userId },
    });
    if (answerCount > 0) {
      badgesToAward.push('first_answer');
    }
  }

  if (!earnedSlugs.has('accepted_5')) {
    const acceptedCount = await tx.answer.count({
      where: { author_id: userId, is_accepted: true },
    });
    if (acceptedCount >= 5) {
      badgesToAward.push('accepted_5');
    }
  }

  if (!earnedSlugs.has('quiz_master')) {
    const correctAttempts = await tx.quizAttempt.count({
      where: { user_id: userId, is_correct: true },
    });
    if (correctAttempts >= 5) {
      badgesToAward.push('quiz_master');
    }
  }

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
