import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { isPublic } from "../utils/public-routes";
import { getRedisClient } from "../config/RedisClient";
import { ENV } from "../config/env";
import { IJwtPayload } from "../types/IJwtPayload";
import { ErrorMessages } from "../shared/constants/ErrorMessages";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  if (isPublic(req)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(`No token provided for ${req.method} ${req.path}`);
    return res.status(401).json({ error: ErrorMessages.AUTH.NO_TOKEN_PROVIDED });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, ENV.JWT_SECRET) as IJwtPayload;

    const userId = payload.userId || payload.id;
    const role = payload.role;

    // Check Redis blocklist — set by auth service when user/worker is blocked
    // Key format matches exactly what BlockUserUseCase and WorkerEventConsumer write
    const redis = getRedisClient();
    const isBlocked = await redis.get(`blocked:${userId}`);

    if (isBlocked) {
      console.log(`Blocked ${role} attempted access: ${userId} — ${req.method} ${req.path}`);
      return res.status(401).json({ 
        error: ErrorMessages.AUTH.ACCOUNT_HAS_BEEN_BLOCKED,
        code: "ACCOUNT_BLOCKED"
      });
    }

    // Set forwarded headers for downstream services
    if (userId) req.headers["x-user-id"] = userId;
    if (payload.email) req.headers["x-user-email"] = payload.email;
    if (role) req.headers["x-user-role"] = role;

    req.user = payload;
    return next();

  } catch (error: unknown) {

    const message = error instanceof Error ? error.message : "unknown error";

    console.log(`Token verification failed for ${req.method} ${req.path}: ${message}`);
    
    return res.status(403).json({ error: ErrorMessages.AUTH.INVALID_OR_EXPIRED_TOKEN});
  }
};