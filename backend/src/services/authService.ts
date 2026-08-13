import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { env } from "../config/env";
import { logger } from "../utils/logger";

// ─── Types ───────────────────────────────────────────────

interface TokenPayload {
  userId: string;
  type: "access" | "refresh";
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Helpers ─────────────────────────────────────────────

function toSafeUser(user: IUser): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function createOperationalError(message: string, statusCode: number): Error {
  const error = new Error(message) as Error & {
    statusCode: number;
    isOperational: boolean;
  };
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

// ─── Token Generation ────────────────────────────────────

export function generateTokens(userId: string): AuthTokens {
  const accessToken = jwt.sign(
    { userId, type: "access" } as TokenPayload,
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );

  const refreshToken = jwt.sign(
    { userId, type: "refresh" } as TokenPayload,
    env.JWT_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  if (payload.type !== "access") {
    throw createOperationalError("Invalid token type", 401);
  }
  return payload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  if (payload.type !== "refresh") {
    throw createOperationalError("Invalid token type", 401);
  }
  return payload;
}

// ─── Auth Operations ─────────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw createOperationalError("Email already registered", 409);
  }

  // Create user (password is hashed by pre-save hook)
  const user = await User.create({ name, email, password });

  const tokens = generateTokens(user._id.toString());

  logger.info("User registered", { userId: user._id, email: user.email });

  return { user: toSafeUser(user), tokens };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  // Find user with password field included
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user) {
    throw createOperationalError("Invalid email or password", 401);
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createOperationalError("Invalid email or password", 401);
  }

  const tokens = generateTokens(user._id.toString());

  logger.info("User logged in", { userId: user._id, email: user.email });

  return { user: toSafeUser(user), tokens };
}

export async function getUserById(userId: string): Promise<SafeUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw createOperationalError("User not found", 404);
  }
  return toSafeUser(user);
}

export async function refreshTokens(
  currentRefreshToken: string
): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  try {
    const payload = verifyRefreshToken(currentRefreshToken);

    // Verify user still exists
    const user = await User.findById(payload.userId);
    if (!user) {
      throw createOperationalError("User not found", 401);
    }

    // Issue new token pair
    const tokens = generateTokens(user._id.toString());

    return { user: toSafeUser(user), tokens };
  } catch (error) {
    if ((error as Error & { statusCode?: number }).statusCode) {
      throw error;
    }
    throw createOperationalError("Invalid or expired refresh token", 401);
  }
}
