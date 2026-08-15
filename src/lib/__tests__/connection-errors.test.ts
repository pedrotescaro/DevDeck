// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { isTransientConnectionError } from '@/lib/connection-errors';

describe('isTransientConnectionError', () => {
  it('recognizes Prisma, network and retryable HTTP failures', () => {
    expect(isTransientConnectionError({ code: 'P1001' })).toBe(true);
    expect(isTransientConnectionError(new TypeError('fetch failed'))).toBe(true);
    expect(isTransientConnectionError({ status: 503 })).toBe(true);
  });

  it('recognizes database pool exhaustion as transient', () => {
    expect(isTransientConnectionError({ code: 'EMAXCONNSESSION' })).toBe(true);
    expect(
      isTransientConnectionError(
        new Error('(EMAXCONNSESSION) max clients reached in session mode - max clients are limited')
      )
    ).toBe(true);
    expect(isTransientConnectionError(new Error('too many connections for role'))).toBe(true);
  });

  it('recognizes temporary DNS lookup failures from the PostgreSQL pooler', () => {
    expect(
      isTransientConnectionError(
        Object.assign(new Error('getaddrinfo ENOENT aws-1-sa-east-1.pooler.supabase.com'), {
          code: 'ENOENT',
        })
      )
    ).toBe(true);
    expect(isTransientConnectionError({ code: 'EAI_AGAIN' })).toBe(true);
    expect(isTransientConnectionError({ code: 'ENOTFOUND' })).toBe(true);
  });

  it('does not confuse invalid credentials with connectivity', () => {
    expect(
      isTransientConnectionError({
        code: 'invalid_credentials',
        message: 'Invalid login credentials',
        status: 400,
      })
    ).toBe(false);
  });
});
