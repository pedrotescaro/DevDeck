import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { EvaluatorService } from '@/services/evaluator.service';

export const GET = apiHandler(async () => {
  const user = await requireAuth();
  const result = await EvaluatorService.checkEligibility(user.id);
  return NextResponse.json(result);
});
