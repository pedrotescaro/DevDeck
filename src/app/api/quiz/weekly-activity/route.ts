import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const GET = apiHandler(async () => {
  const user = await requireAuth();

  // Get the current week's start (Sunday) and end (Saturday)
  const now = new Date();
  const currentDay = now.getDay(); // 0=Sunday, 6=Saturday

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - currentDay);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // Fetch all quiz attempts by the user in the current week
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      user_id: user.id,
      created_at: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
    select: {
      created_at: true,
    },
  });

  // Build a set of day indices (0=Sunday, 6=Saturday) that have attempts
  const activeDays = new Set<number>();
  for (const attempt of attempts) {
    const dayIndex = attempt.created_at.getDay();
    activeDays.add(dayIndex);
  }

  return NextResponse.json({
    weekDays: Array.from({ length: 7 }, (_, i) => ({
      index: i,
      active: activeDays.has(i),
    })),
  });
});
