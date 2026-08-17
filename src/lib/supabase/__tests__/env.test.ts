// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getSupabasePublicConfig,
  getSupabasePublishableKey,
  isSupabasePublicConfigured,
} from '@/lib/supabase/env';

describe('Supabase public environment configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers the modern publishable key', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'modern-key');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'legacy-key');

    expect(getSupabasePublishableKey()).toBe('modern-key');
    expect(getSupabasePublicConfig()).toEqual({
      url: 'https://example.supabase.co',
      key: 'modern-key',
    });
  });

  it('supports the legacy anon key as a fallback', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'legacy-key');

    expect(getSupabasePublishableKey()).toBe('legacy-key');
    expect(isSupabasePublicConfigured()).toBe(true);
  });

  it('reports missing public configuration without using placeholders', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');

    expect(isSupabasePublicConfigured()).toBe(false);
    expect(() => getSupabasePublicConfig()).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL.*NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/
    );
  });

  it('strips accidental quotes around environment variable values', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '"https://example.supabase.co"');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', '"modern-key"');

    expect(getSupabasePublicConfig()).toEqual({
      url: 'https://example.supabase.co',
      key: 'modern-key',
    });
  });
});
