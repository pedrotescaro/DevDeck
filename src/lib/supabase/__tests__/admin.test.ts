// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const createClient = vi.hoisted(() => vi.fn());

vi.mock('@supabase/supabase-js', () => ({ createClient }));

describe('Supabase admin client configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not create a client without a server-only key', async () => {
    vi.stubEnv('SUPABASE_SECRET_KEY', '');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');

    const { getSupabaseAdminClient } = await import('@/lib/supabase/admin');

    expect(getSupabaseAdminClient()).toBeNull();
    expect(createClient).not.toHaveBeenCalled();
  });

  it('prefers the modern secret key and keeps the legacy key as a fallback', async () => {
    const client = { kind: 'admin-client' };
    createClient.mockReturnValue(client);
    vi.stubEnv('SUPABASE_SECRET_KEY', 'modern-secret');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'legacy-secret');

    const { getSupabaseAdminClient } = await import('@/lib/supabase/admin');

    expect(getSupabaseAdminClient()).toBe(client);
    expect(createClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'modern-secret',
      expect.objectContaining({
        auth: { autoRefreshToken: false, persistSession: false },
      })
    );
  });

  it('supports the legacy service-role key when no secret key exists', async () => {
    const client = { kind: 'legacy-admin-client' };
    createClient.mockReturnValue(client);
    vi.stubEnv('SUPABASE_SECRET_KEY', '');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'legacy-secret');

    const { getSupabaseAdminClient } = await import('@/lib/supabase/admin');

    expect(getSupabaseAdminClient()).toBe(client);
    expect(createClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'legacy-secret',
      expect.any(Object)
    );
  });
});
