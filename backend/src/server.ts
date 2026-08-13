import app from "./app";
import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/db";
import { getRedisClient, disconnectRedis } from "./config/redis";
import { getResearchQueue, closeQueues } from "./config/queue";
import { logger } from "./utils/logger";

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Initialize Redis connection
    getRedisClient();

    // Initialize BullMQ queue (ensures it's ready)
    getResearchQueue();

    // Start HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(
        `ProductLens Backend running on port ${env.PORT} [${env.NODE_ENV}]`
      );
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);

      server.close(async () => {
        await closeQueues();
        await disconnectRedis();
        await disconnectDatabase();
        logger.info("Server shut down complete");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

startServer();
