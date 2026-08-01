-- Keep the server-only HTTPS fallback available after Supabase stopped
-- exposing public-schema tables to API roles automatically.
-- Vanilla PostgreSQL Docker installs do not have this Supabase-specific role.
DO $grant_service_role$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    EXECUTE 'GRANT USAGE ON SCHEMA public TO service_role';
    EXECUTE 'GRANT SELECT ON TABLE public."User", public."UserBadge", public."Badge", public."LanguageTrail" TO service_role';
    EXECUTE 'GRANT UPDATE (streak_days, last_active_at) ON TABLE public."User" TO service_role';
  END IF;
END
$grant_service_role$;
