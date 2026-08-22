import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import { executeCode } from '@/lib/code-execution/server';
import { RATE_LIMIT_CODE_RUN } from '@/lib/config';
import { rateLimit } from '@/lib/ratelimit';

const runSchema = z.object({
  code: z.string().min(1).max(10_000),
  language: z.string().min(1),
});

export const POST = apiHandler(async (request) => {
  await rateLimit('code-run:global', {
    ...RATE_LIMIT_CODE_RUN,
    endpoint: '/api/run',
  });

  const { code, language } = runSchema.parse(await request.json());
  const normalized = language.toLowerCase();

  if (['javascript', 'typescript', 'js', 'ts'].includes(normalized)) {
    return NextResponse.json(
      { ok: false, output: '', error: 'JavaScript e TypeScript rodam no navegador.' },
      { status: 400 }
    );
  }

  const result = await executeCode(code, normalized);
  const status = result.error?.startsWith('Linguagem') ? 400 : result.executionMs === 0 ? 502 : 200;

  return NextResponse.json(result, { status });
});
