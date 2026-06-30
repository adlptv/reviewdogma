import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
    });
  }
} catch {
  // Rate limiting disabled — running without Redis
}

export async function rateLimit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number }> {
  if (!ratelimit) {
    return { success: true, limit: 100, remaining: 99 };
  }
  const result = await ratelimit.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
  };
}
