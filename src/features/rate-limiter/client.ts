import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

import { UPSTASH_CONFIGS } from "./constants";

export const redisClient = new Redis({
  url: "UPSTASH_REDIS_REST_URL",
  token: "UPSTASH_REDIS_REST_TOKEN",
});

export const ratelimit = new Ratelimit({
  redis: redisClient,
  limiter: Ratelimit.slidingWindow(
    UPSTASH_CONFIGS.maxRequests,
    UPSTASH_CONFIGS.requestsWindow
  ),
});
