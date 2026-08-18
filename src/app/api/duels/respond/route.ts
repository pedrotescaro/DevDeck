import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { DuelService } from '@/services/duel.service';
import { z } from 'zod';

const respondSchema = z.object({
  request_id: z.string(),
  action: z.enum(['ACCEPT', 'REJECT']),
});

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();
  const body = await req.json();
  const parsed = respondSchema.parse(body);

  const result = await DuelService.respondDuelRequest(parsed.request_id, user.id, parsed.action);

  return NextResponse.json({
    success: true,
    ...result,
  });
});
