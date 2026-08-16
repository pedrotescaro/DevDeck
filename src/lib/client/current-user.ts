import { createClient } from '@/lib/supabase/client';

const CURRENT_USER_TTL_MS = 60_000;
const MAX_REQUEST_ATTEMPTS = 3;
const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
const CONNECTION_EVENT = 'stacklyst:connection-state';

let cachedUser: { value: unknown; expiresAt: number } | null = null;
let pendingUserRequest: Promise<unknown | null> | null = null;
let cacheGeneration = 0;

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function reportConnectionState(state: 'degraded' | 'restored') {
  window.dispatchEvent(new CustomEvent(CONNECTION_EVENT, { detail: { state } }));
}

async function browserSessionIsValid() {
  try {
    const { data, error } = await createClient().auth.getClaims();
    return !error && typeof data?.claims?.sub === 'string';
  } catch {
    return false;
  }
}

async function requestCurrentUser() {
  let lastError: Error | null = null;
  let connectionWasDegraded = false;

  for (let attempt = 0; attempt < MAX_REQUEST_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch('/api/users/me', {
        cache: 'no-store',
        credentials: 'same-origin',
      });

      if (response.status === 401) {
        // A parallel server refresh may have consumed the old single-use token.
        // Let the browser synchronize/refresh its cookie once before signing out.
        if (attempt === 0 && (await browserSessionIsValid())) {
          await wait(150);
          continue;
        }
        return null;
      }

      if (RETRYABLE_STATUSES.has(response.status)) {
        throw new Error(`Conexão temporariamente indisponível (${response.status})`);
      }

      if (!response.ok) {
        throw new Error(`Falha ao carregar usuário (${response.status})`);
      }

      const user = await response.json();
      if (connectionWasDegraded) reportConnectionState('restored');
      return user;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === MAX_REQUEST_ATTEMPTS - 1) break;

      connectionWasDegraded = true;
      reportConnectionState('degraded');
      await wait(250 * 2 ** attempt);
    }
  }

  throw lastError || new Error('Conexão temporariamente indisponível');
}

export async function getCurrentUser<T>() {
  const now = Date.now();

  if (cachedUser && cachedUser.expiresAt > now) {
    return cachedUser.value as T;
  }

  if (pendingUserRequest) {
    return pendingUserRequest as Promise<T | null>;
  }

  const requestGeneration = cacheGeneration;
  const request = requestCurrentUser()
    .then((user) => {
      if (requestGeneration !== cacheGeneration) return user;

      if (user) {
        cachedUser = { value: user, expiresAt: Date.now() + CURRENT_USER_TTL_MS };
      } else {
        cachedUser = null;
      }
      return user;
    })
    .finally(() => {
      if (pendingUserRequest === request) pendingUserRequest = null;
    });

  pendingUserRequest = request;
  return request as Promise<T | null>;
}

export function invalidateCurrentUser() {
  cacheGeneration += 1;
  cachedUser = null;
  pendingUserRequest = null;
}
