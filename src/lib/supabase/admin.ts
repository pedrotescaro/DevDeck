import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl } from '@/lib/supabase/env';

/**
 * Supabase admin client (service role) for server-side operations.
 * Uses HTTPS (port 443) — works even on networks that block PostgreSQL ports.
 */
const supabaseUrl = getSupabaseUrl();
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

function isValidHttpUrl(urlString: string) {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

let supabaseAdmin: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey && isValidHttpUrl(supabaseUrl)) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch {
    supabaseAdmin = null;
  }
}

export function getSupabaseAdminClient() {
  return supabaseAdmin;
}
