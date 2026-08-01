// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { isTransientConnectionError } from '@/lib/connection-errors';

describe('isTransientConnectionError', () => {
  it('recognizes Prisma, network and retryable HTTP failures', () => {
    expect(isTransientConnectionError({ code: 'P1001' })).toBe(true);
    expect(isTransientConnectionError(new TypeError('fetch failed'))).toBe(true);
    expect(isTransientConnectionError({ status: 503 })).toBe(true);
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
