import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl } from '@/lib/supabase/env';

/**
 * Supabase admin client (service role) for server-side operations.
 * Uses HTTPS (port 443) — works even on networks that block PostgreSQL ports.
 */
const supabaseUrl = getSupabaseUrl();
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

const supabaseAdmin =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export function getSupabaseAdminClient() {
  return supabaseAdmin;
}
