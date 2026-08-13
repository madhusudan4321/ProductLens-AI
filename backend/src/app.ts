import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import healthRoutes from "./routes/health";

const app = express();

// ---------------------
// Security & Middleware
// ---------------------
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------------
// Routes
// ---------------------
app.use("/api/health", healthRoutes);

// ---------------------
// Error handling
// ---------------------
app.use(errorHandler);

export default app;
