import Redis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger";

let redisClient: Redis | null = null;

export function getRedisConnection(): Redis {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: true,
      retryStrategy(times: number) {
        const delay = Math.min(times * 200, 5000);
        logger.warn(`Redis reconnecting... attempt ${times}`);
        return delay;
      },
    });

    redisClient.on("connect", () => {
      logger.info("Worker Redis connected");
    });

    redisClient.on("error", (err) => {
      logger.error("Worker Redis error", { error: err.message });
    });
  }

  return redisClient;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info("Worker Redis disconnected");
  }
}
