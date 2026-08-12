// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  from: vi.fn(),
  getAuthUserId: vi.fn(),
  getSupabaseAdminClient: vi.fn(),
  hasDatabaseConnection: vi.fn(),
  loggerError: vi.fn(),
  loggerWarn: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  hasDatabaseConnection: mocks.hasDatabaseConnection,
  prisma: {
    user: {
      findUnique: mocks.findUnique,
      update: vi.fn(),
    },
  },
}));
vi.mock('@/lib/auth-session', () => ({
  getAuthUserId: mocks.getAuthUserId,
}));
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseAdminClient: mocks.getSupabaseAdminClient,
}));
vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: mocks.loggerError,
    info: vi.fn(),
    warn: mocks.loggerWarn,
  },
}));

import { getAuthUser } from '@/lib/auth';
import { ConnectionError } from '@/lib/errors';

describe('authentication connection resilience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAuthUserId.mockResolvedValue('user-1');
    mocks.hasDatabaseConnection.mockReturnValue(true);
    mocks.getSupabaseAdminClient.mockReturnValue({ from: mocks.from });
  });

  it('keeps auth distinct from a database outage', async () => {
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

  it('does not query unconfigured user-data backends', async () => {
    mocks.hasDatabaseConnection.mockReturnValue(false);
    mocks.getSupabaseAdminClient.mockReturnValue(null);

    await expect(getAuthUser()).rejects.toEqual(
      expect.objectContaining<Partial<ConnectionError>>({
        code: 'USER_DATA_NOT_CONFIGURED',
        statusCode: 503,
      })
    );

    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.from).not.toHaveBeenCalled();
    expect(mocks.loggerError).not.toHaveBeenCalled();
    expect(mocks.loggerWarn).toHaveBeenCalledWith(
      'User data backends are not configured',
      expect.objectContaining({ databaseConfigured: false, restFallbackConfigured: false })
    );
  });

  it('uses the configured REST fallback when PostgreSQL is absent', async () => {
    mocks.hasDatabaseConnection.mockReturnValue(false);
    mocks.from.mockImplementation((table: string) => {
      if (table === 'User') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: () =>
                Promise.resolve({
                  data: {
                    id: 'user-1',
                    created_at: '2026-08-11T00:00:00.000Z',
                    last_active_at: null,
                    birthday: null,
                    streak_days: 0,
                  },
                  error: null,
                }),
            }),
          }),
        };
      }

      return {
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
      };
    });

    await expect(getAuthUser()).resolves.toEqual(
      expect.objectContaining({ id: 'user-1', badges: [], trails: [] })
    );
    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.from).toHaveBeenCalledWith('User');
  });
});
