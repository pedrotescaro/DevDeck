// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  from: vi.fn(),
  getClaims: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: mocks.findUnique,
      update: vi.fn(),
    },
  },
}));
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({ auth: { getClaims: mocks.getClaims } })),
}));
vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: { from: mocks.from },
}));
vi.mock('@/lib/jwt', () => ({
  getJwtUser: vi.fn(),
}));
vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

import { getAuthUser } from '@/lib/auth';
import { ConnectionError } from '@/lib/errors';

describe('authentication connection resilience', () => {
  it('keeps auth distinct from a database outage', async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: { sub: 'user-1' } }, error: null });
    mocks.findUnique.mockRejectedValue(
      Object.assign(new Error('Database server unreachable'), { code: 'P1001' })
    );
    mocks.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.reject(new TypeError('fetch failed')),
        }),
      }),
    });

    await expect(getAuthUser()).rejects.toEqual(
      expect.objectContaining<Partial<ConnectionError>>({
        code: 'USER_DATA_UNAVAILABLE',
        statusCode: 503,
      })
    );
  });
});
