import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

interface WorkerEnvConfig {
  NODE_ENV: string;
  REDIS_URL: string;
  WORKER_CONCURRENCY: number;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: WorkerEnvConfig = {
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  REDIS_URL: getEnvVar("REDIS_URL"),
  WORKER_CONCURRENCY: parseInt(getEnvVar("WORKER_CONCURRENCY", "2"), 10),
};
