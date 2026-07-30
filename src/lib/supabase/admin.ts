import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client (service role) for server-side operations.
 * Uses HTTPS (port 443) — works even on networks that block PostgreSQL ports.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
