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
    'UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN are missing. Rate limiting is disabled (graceful fallback).'
  );
}

export async function rateLimit(
  identifier: string,
  config: { limit: number; window: string; endpoint: string }
): Promise<void> {
  const { limit, window, endpoint } = config;

  if (!redisClient) {
    logger.warn('Rate limiting disabled — UPSTASH not configured', {
      identifier,
      endpoint,
    });
    return;
  }

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

    // Save rate limit metrics to AsyncLocalStorage store so apiHandler can append headers
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

    logger.debug('Rate limit check passed', {
      identifier,
      endpoint,
      remaining,
    });
  } catch (error: any) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    logger.error('Rate limiting execution error, allowing request through fallback', {
      error: error?.message || String(error),
      identifier,
      endpoint,
    });
  }
}
