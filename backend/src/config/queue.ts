import { Queue } from "bullmq";
import { getRedisClient } from "./redis";
import { logger } from "../utils/logger";

// Queue names — centralized for consistency across backend and workers
export const QUEUE_NAMES = {
  PRODUCT_RESEARCH: "product-research",
} as const;

let researchQueue: Queue | null = null;

export function getResearchQueue(): Queue {
  if (!researchQueue) {
    const connection = getRedisClient();

    researchQueue = new Queue(QUEUE_NAMES.PRODUCT_RESEARCH, {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: {
          count: 100,  // Keep last 100 completed jobs
        },
        removeOnFail: {
          count: 50,   // Keep last 50 failed jobs
        },
      },
    });

    logger.info(`BullMQ queue initialized: ${QUEUE_NAMES.PRODUCT_RESEARCH}`);
  }

  return researchQueue;
}

export async function closeQueues(): Promise<void> {
  if (researchQueue) {
    await researchQueue.close();
    researchQueue = null;
    logger.info("BullMQ queues closed");
  }
}
