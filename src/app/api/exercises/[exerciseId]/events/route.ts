import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import { NotFoundError, UnauthorizedError } from '@/lib/errors';
import { getExerciseForEvaluation, recordAssistanceEvent } from '@/lib/exercises/repository';

const eventSchema = z.object({
  eventType: z.enum(['HINT_OPENED', 'DOCUMENTATION_OPENED']),
  assistanceMode: z.enum(['GUIDED', 'STANDARD', 'HARD', 'NO_ASSIST']),
});

export const POST = apiHandler(async (request, { session, params }) => {
  if (!session) throw new UnauthorizedError();

  const { exerciseId } = await params;
  const payload = eventSchema.parse(await request.json());
  const exercise = await getExerciseForEvaluation(exerciseId, false);
  if (!exercise) throw new NotFoundError('EXERCISE_NOT_FOUND', 'Exercício não encontrado.');

  await recordAssistanceEvent({
    exerciseId: exercise.id,
    userId: session.id,
    ...payload,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
});
