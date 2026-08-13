import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/authService";
import { logger } from "../utils/logger";

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

/**
 * Authentication middleware.
 * Extracts access token from HTTP-only cookie, verifies it,
 * and attaches user info to the request.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    const payload = verifyAccessToken(token);

    req.user = { userId: payload.userId };

    next();
  } catch (error) {
    logger.debug("Authentication failed", {
      error: (error as Error).message,
    });

    res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
}
