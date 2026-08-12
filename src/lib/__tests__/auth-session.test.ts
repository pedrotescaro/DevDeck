// @vitest-environment node

import { AuthRetryableFetchError } from '@supabase/supabase-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getClaims: vi.fn(),
  getJwtUser: vi.fn(),
  loggerDebug: vi.fn(),
  loggerWarn: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({ auth: { getClaims: mocks.getClaims } })),
}));
vi.mock('@/lib/jwt', () => ({
  getJwtUser: mocks.getJwtUser,
}));
vi.mock('@/lib/logger', () => ({
  logger: {
    debug: mocks.loggerDebug,
    error: vi.fn(),
    info: vi.fn(),
    warn: mocks.loggerWarn,
  },
}));

import { getAuthIdentity, getAuthUserId } from '@/lib/auth-session';

describe('server-side auth session resolution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'test-publishable-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses verified Supabase claims as the primary identity', async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: { sub: 'user-1' } }, error: null });

    await expect(getAuthUserId()).resolves.toBe('user-1');
    expect(mocks.getJwtUser).not.toHaveBeenCalled();
  });

  it('uses the local JWT only for a temporary Supabase failure', async () => {
    mocks.getClaims.mockResolvedValue({
      data: null,
      error: new AuthRetryableFetchError('Service temporarily unavailable', 503),
    });
    mocks.getJwtUser.mockResolvedValue({ sub: 'user-2' });

    await expect(getAuthUserId()).resolves.toBe('user-2');
    expect(mocks.getJwtUser).toHaveBeenCalledOnce();
  });

  it('does not let a local JWT override an invalid Supabase session', async () => {
    mocks.getClaims.mockResolvedValue({
      data: null,
      error: { code: 'refresh_token_not_found', message: 'Invalid refresh token', status: 400 },
    });

    await expect(getAuthUserId()).resolves.toBeNull();
    expect(mocks.getJwtUser).not.toHaveBeenCalled();
  });

  it('degrades the optional landing identity to null during an outage', async () => {
    mocks.getClaims.mockRejectedValue(new TypeError('fetch failed'));

    await expect(getAuthIdentity()).resolves.toBeNull();
    expect(mocks.loggerWarn).toHaveBeenCalledWith(
      'Could not resolve the optional landing-page session',
      expect.objectContaining({ errorMessage: 'fetch failed' })
    );
  });

  it('keeps the landing anonymous when public Auth is not configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', '');

    await expect(getAuthIdentity()).resolves.toBeNull();
    expect(mocks.getClaims).not.toHaveBeenCalled();
  });
});
