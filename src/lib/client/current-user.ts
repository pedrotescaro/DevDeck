const CURRENT_USER_TTL_MS = 60_000;

let cachedUser: { value: unknown; expiresAt: number } | null = null;
let pendingUserRequest: Promise<unknown | null> | null = null;
let cacheGeneration = 0;

export async function getCurrentUser<T>() {
  const now = Date.now();

  if (cachedUser && cachedUser.expiresAt > now) {
    return cachedUser.value as T;
  }

  if (pendingUserRequest) {
    return pendingUserRequest as Promise<T | null>;
  }

  const requestGeneration = cacheGeneration;
  const request = fetch('/api/users/me')
    .then(async (response) => {
      if (response.status === 401) {
        if (requestGeneration === cacheGeneration) cachedUser = null;
        return null;
      }

      if (!response.ok) {
        throw new Error(`Falha ao carregar usuario (${response.status})`);
      }

      const user = await response.json();
      if (requestGeneration === cacheGeneration) {
        cachedUser = { value: user, expiresAt: Date.now() + CURRENT_USER_TTL_MS };
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
