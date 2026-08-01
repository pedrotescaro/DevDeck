import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import { isTransientConnectionError } from '@/lib/connection-errors';

const RECOVERABLE_AUTH_CODES = new Set([
  'over_request_rate_limit',
  'refresh_token_already_used',
  'request_timeout',
]);

/**
 * Auth failures for which a short-lived, locally signed fallback is acceptable.
 * Invalid, expired, missing or revoked sessions are deliberately excluded.
 */
export function isTemporaryAuthFailure(error: unknown): boolean {
  if (!error) return false;
  if (isAuthRetryableFetchError(error) || isTransientConnectionError(error)) return true;

  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' && RECOVERABLE_AUTH_CODES.has(code);
}
