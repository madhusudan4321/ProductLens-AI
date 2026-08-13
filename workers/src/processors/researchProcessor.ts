import { Job } from "bullmq";
import { logger } from "../utils/logger";

/**
 * Placeholder processor for the product research queue.
 * This will be replaced with actual research logic in Phase 4.
 */
export async function processResearchJob(job: Job): Promise<void> {
  logger.info(`Processing research job: ${job.id}`, {
    jobId: job.id,
    data: job.data,
  });

  // Placeholder — actual research pipeline will be implemented in Phase 4
  logger.info(`Research job ${job.id} completed (placeholder)`);
}
