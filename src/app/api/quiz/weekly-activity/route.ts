import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const GET = apiHandler(async (req) => {
  const authUser = await requireAuth();
  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get('userId') || authUser.id;

  // Use UTC consistently so server region and daylight-saving changes do not shift streak days.
  const now = new Date();
  const currentDay = now.getUTCDay(); // 0=Sunday, 6=Saturday

  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - currentDay);
  weekStart.setUTCHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);

  // Fetch all quiz attempts by the target user in the current week
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      user_id: targetUserId,
      created_at: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
    select: {
      created_at: true,
    },
  });

  // Count attempts per day (0=Sunday, 6=Saturday)
  const dailyCounts = new Map<number, number>();
  for (const attempt of attempts) {
    const dayIndex = attempt.created_at.getUTCDay();
    dailyCounts.set(dayIndex, (dailyCounts.get(dayIndex) || 0) + 1);
  }

  return NextResponse.json({
    today: now.toISOString(),
    weekDays: Array.from({ length: 7 }, (_, i) => ({
      index: i,
      count: dailyCounts.get(i) || 0,
    })),
  });
});
