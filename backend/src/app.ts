import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";

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
app.use(cookieParser());

// ---------------------
// Routes
// ---------------------
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// ---------------------
// Error handling
// ---------------------
app.use(errorHandler);

export default app;

