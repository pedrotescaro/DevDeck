import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { RateLimitError } from './errors';
import { logger } from './logger';
import { rateLimitStorage } from './api-handler';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const limiters = new Map<string, Ratelimit>();

let redisClient: Redis | null = null;
if (redisUrl && redisToken) {
  try {
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  } catch (error) {
    logger.warn('Failed to initialize Upstash Redis client', { error: String(error) });
  }
} else {
  logger.warn(
    'UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN are missing. Using local rate limiter.'
  );
}

/* ── Local fallback rate limiter (in-memory LRU) ────────────── */

interface LocalBucket {
  count: number;
  resetAt: number;
}

const localBuckets = new Map<string, LocalBucket>();

function parseWindowToMs(window: string): number {
  const match = window.match(/^(\d+)\s*(s|m|h)$/);
  if (!match) return 60_000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  if (unit === 's') return value * 1_000;
  if (unit === 'm') return value * 60_000;
  if (unit === 'h') return value * 3_600_000;
  return 60_000;
}

function localRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const bucket = localBuckets.get(identifier);

  if (!bucket || now > bucket.resetAt) {
    localBuckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  bucket.count++;
  const remaining = Math.max(0, limit - bucket.count);
  return { success: bucket.count <= limit, remaining, reset: bucket.resetAt };
}

// Cleanup stale buckets every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, bucket] of localBuckets.entries()) {
      if (now > bucket.resetAt) localBuckets.delete(key);
    }
  },
  5 * 60 * 1_000
).unref();

/* ── Main rate limit function ───────────────────────────────── */

export async function rateLimit(
  identifier: string,
  config: { limit: number; window: string; endpoint: string }
): Promise<void> {
  const { limit, window, endpoint } = config;

  // Try Upstash first
  if (redisClient) {
    const key = `${limit}_${window}`;
    let limiter = limiters.get(key);

    if (!limiter) {
      limiter = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(limit, window as any),
        analytics: true,
        prefix: '@upstash/ratelimit/devdeck',
      });
      limiters.set(key, limiter);
    }

    try {
      const { success, remaining, reset } = await limiter.limit(identifier);

      const store = rateLimitStorage.getStore();
      if (store) {
        store.limit = limit;
        store.remaining = remaining;
        store.reset = reset;
      }

      if (!success) {
        logger.warn('Rate limit exceeded', {
          identifier,
          endpoint,
          reset: new Date(reset).toISOString(),
        });
        throw new RateLimitError('RATE_LIMITED', 'Muitas requisições. Tente novamente em breve.', {
          reset,
          remaining: 0,
          limit,
        });
      }

      logger.debug('Rate limit check passed (Upstash)', { identifier, endpoint, remaining });
      return;
    } catch (error: any) {
      if (error instanceof RateLimitError) throw error;
      logger.error('Upstash rate limit error, falling back to local', {
        error: error?.message || String(error),
        identifier,
        endpoint,
      });
    }
  }

  // Fallback: local in-memory rate limiter
  const windowMs = parseWindowToMs(window);
  const { success, remaining, reset } = localRateLimit(identifier, limit, windowMs);

  const store = rateLimitStorage.getStore();
  if (store) {
    store.limit = limit;
    store.remaining = remaining;
    store.reset = reset;
  }

  if (!success) {
    logger.warn('Rate limit exceeded (local)', {
      identifier,
      endpoint,
      reset: new Date(reset).toISOString(),
    });
    throw new RateLimitError('RATE_LIMITED', 'Muitas requisições. Tente novamente em breve.', {
      reset,
      remaining: 0,
      limit,
    });
  }

  logger.debug('Rate limit check passed (local)', { identifier, endpoint, remaining });
}
