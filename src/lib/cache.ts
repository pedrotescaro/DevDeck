/**
 * Lightweight in-memory cache with TTL support.
 *
 * Used for hot paths like daily quiz, leaderboard, and user profiles.
 * Falls back gracefully when Redis is not configured.
 *
 * For production with high traffic, swap the Map for Upstash Redis GET/SET
 * with TTL — the interface stays the same.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<any>>();

/**
 * Get a cached value by key. Returns null if expired or missing.
 */
export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

/**
 * Set a cached value with a TTL in seconds.
 */
export function cacheSet<T>(key: string, value: T, ttlSeconds: number): void {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Invalidate a specific cache key.
 */
export function cacheDelete(key: string): void {
  store.delete(key);
}

/**
 * Invalidate all keys matching a prefix.
 * Useful for "invalidate all user profile caches" patterns.
 */
export function cacheDeleteByPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}

/**
 * Wrap an async function with caching.
 * If the key has a valid cache hit, returns cached value.
 * Otherwise calls the function, caches the result, and returns it.
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = cacheGet<T>(key);
  if (cached !== null) return cached;

  const value = await fn();
  cacheSet(key, value, ttlSeconds);
  return value;
}
