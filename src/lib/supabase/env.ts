function readEnv(value: string | undefined) {
  return value?.trim() ?? '';
}

export function getSupabaseUrl() {
  return readEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabasePublishableKey() {
  return (
    readEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    readEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function isSupabasePublicConfigured() {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

export function getSupabasePublicConfig() {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  const missing: string[] = [];

  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!key) {
    missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  }

  if (missing.length > 0) {
    throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}`);
  }

  return { url, key };
}
