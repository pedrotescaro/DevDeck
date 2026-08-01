import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { UnauthorizedError } from '@/lib/errors';

export const GET = apiHandler(async (_request, { session }) => {
  if (!session) {
    throw new UnauthorizedError();
  }

  return NextResponse.json(session);
});
