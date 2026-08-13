import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { getRedisClient } from "../config/redis";
import { logger } from "../utils/logger";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const checks: Record<string, string> = {};

  // MongoDB check
  try {
    const mongoState = mongoose.connection.readyState;
    checks.mongodb =
      mongoState === 1
        ? "connected"
        : mongoState === 2
          ? "connecting"
          : "disconnected";
  } catch {
    checks.mongodb = "error";
  }

  // Redis check
  try {
    const redis = getRedisClient();
    await redis.ping();
    checks.redis = "connected";
  } catch {
    checks.redis = "error";
  }

  const allHealthy = Object.values(checks).every(
    (status) => status === "connected"
  );

  const status = allHealthy ? "healthy" : "degraded";
  const httpStatus = allHealthy ? 200 : 503;

  logger.debug("Health check", { status, checks });

  res.status(httpStatus).json({
    success: allHealthy,
    status,
    service: "productlens-backend",
    timestamp: new Date().toISOString(),
    checks,
  });
});

export default router;
