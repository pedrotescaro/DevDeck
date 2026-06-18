import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

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
    console.warn('⚠️ Failed to initialize Upstash Redis client:', error);
  }
} else {
  console.warn(
    '⚠️ UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN are missing. Rate limiting is disabled (graceful fallback).'
  );
}

export async function rateLimit(
  identifier: string,
  limit: number,
  window: `${number} s` | `${number} m` | `${number} h` | `${number} d`
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (!redisClient) {
    return {
      success: true,
      remaining: limit,
      reset: Date.now(),
    };
  }

  const key = `${limit}_${window}`;
  let limiter = limiters.get(key);

  if (!limiter) {
    limiter = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(limit, window),
      analytics: true,
      prefix: '@upstash/ratelimit/devdeck',
    });
    limiters.set(key, limiter);
  }

  try {
    const { success, remaining, reset } = await limiter.limit(identifier);
    return { success, remaining, reset };
  } catch (error) {
    console.error('⚠️ Rate limiting execution error, allowing request through fallback:', error);
    return {
      success: true,
      remaining: limit,
      reset: Date.now(),
    };
  }
}
