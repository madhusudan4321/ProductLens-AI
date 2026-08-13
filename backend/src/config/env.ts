import dotenv from "dotenv";
import path from "path";

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// Also try loading from root project directory
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  AI_SERVICE_URL: string;
  FRONTEND_URL: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  PORT: parseInt(getEnvVar("BACKEND_PORT", "5000"), 10),
  MONGODB_URI: getEnvVar("MONGODB_URI"),
  REDIS_URL: getEnvVar("REDIS_URL"),
  JWT_SECRET: getEnvVar("JWT_SECRET", "dev-secret-change-me"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "15m"),
  JWT_REFRESH_EXPIRES_IN: getEnvVar("JWT_REFRESH_EXPIRES_IN", "7d"),
  AI_SERVICE_URL: getEnvVar("AI_SERVICE_URL", "http://localhost:8000"),
  FRONTEND_URL: getEnvVar("FRONTEND_URL", "http://localhost:3000"),
};
