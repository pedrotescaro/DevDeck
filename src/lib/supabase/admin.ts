import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client (service role) for server-side operations.
 * Uses HTTPS (port 443) — works even on networks that block PostgreSQL ports.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
