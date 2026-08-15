const TRANSIENT_ERROR_CODES = new Set([
  'EAI_AGAIN',
  'ECONNABORTED',
  'ECONNREFUSED',
  'ECONNRESET',
  'EHOSTUNREACH',
  'EMAXCONNSESSION',
  'ENETDOWN',
  'ENETUNREACH',
  'ENOTFOUND',
  'EPIPE',
  'ETIMEDOUT',
  'P1001',
  'P1002',
  'P1017',
]);

const TRANSIENT_HTTP_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

const TRANSIENT_MESSAGE_PARTS = [
  'connection closed',
  'connection refused',
  'connection terminated',
  'connection timeout',
  'failed to fetch',
  'fetch failed',
  'getaddrinfo eai_again',
  'getaddrinfo enoent',
  'getaddrinfo enotfound',
  'emaxconnsession',
  'max clients reached',
  'network error',
  'network request failed',
  'server closed the connection',
  'socket hang up',
  'timed out',
  'timeout',
  'too many connections',
];

type ErrorLike = {
  cause?: unknown;
  code?: unknown;
  message?: unknown;
  status?: unknown;
  statusCode?: unknown;
};

/**
 * Identifies infrastructure failures that may succeed on a retry or fallback.
 * Authentication/validation errors intentionally do not match this helper.
 */
export function isTransientConnectionError(error: unknown, depth = 0): boolean {
  if (!error || depth > 2) return false;

  const candidate = error as ErrorLike;
  const code = typeof candidate.code === 'string' ? candidate.code.toUpperCase() : '';
  if (TRANSIENT_ERROR_CODES.has(code)) return true;

  const status =
    typeof candidate.status === 'number'
      ? candidate.status
      : typeof candidate.statusCode === 'number'
        ? candidate.statusCode
        : null;
  if (status !== null && TRANSIENT_HTTP_STATUSES.has(status)) return true;

  const message =
    typeof candidate.message === 'string'
      ? candidate.message.toLowerCase()
      : String(error).toLowerCase();
  if (TRANSIENT_MESSAGE_PARTS.some((part) => message.includes(part))) return true;

  return candidate.cause ? isTransientConnectionError(candidate.cause, depth + 1) : false;
}

export function getErrorSummary(error: unknown): { code?: string; errorMessage: string } {
  const candidate = error as ErrorLike;
  return {
    ...(typeof candidate?.code === 'string' ? { code: candidate.code } : {}),
    errorMessage:
      typeof candidate?.message === 'string' ? candidate.message : String(error ?? 'Unknown error'),
  };
}
