import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const resetLevelSchema = z.object({
  question_ids: z.array(z.string()),
});

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();

  const body = await req.json();
  const parsed = resetLevelSchema.parse(body);

  await prisma.quizAttempt.deleteMany({
    where: {
      user_id: user.id,
      quiz_id: { in: parsed.question_ids },
    },
  });

  return NextResponse.json({ success: true });
});
