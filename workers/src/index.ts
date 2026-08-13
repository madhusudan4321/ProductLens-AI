import { Worker } from "bullmq";
import { env } from "./config/env";
import { getRedisConnection, disconnectRedis } from "./config/redis";
import { QUEUE_NAMES } from "./config/queue";
import { processResearchJob } from "./processors/researchProcessor";
import { logger } from "./utils/logger";

async function startWorker(): Promise<void> {
  try {
    const connection = getRedisConnection();

    const worker = new Worker(
      QUEUE_NAMES.PRODUCT_RESEARCH,
      processResearchJob,
      {
        connection,
        concurrency: env.WORKER_CONCURRENCY,
      }
    );

    worker.on("completed", (job) => {
      logger.info(`Job completed: ${job.id}`);
    });

    worker.on("failed", (job, err) => {
      logger.error(`Job failed: ${job?.id}`, { error: err.message });
    });

    worker.on("error", (err) => {
      logger.error("Worker error", { error: err.message });
    });

    logger.info(
      `ProductLens Worker started [${env.NODE_ENV}] — concurrency: ${env.WORKER_CONCURRENCY}`
    );
    logger.info(`Listening on queue: ${QUEUE_NAMES.PRODUCT_RESEARCH}`);

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down worker`);
      await worker.close();
      await disconnectRedis();
      logger.info("Worker shut down complete");
      process.exit(0);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start worker", { error });
    process.exit(1);
  }
}

startWorker();
