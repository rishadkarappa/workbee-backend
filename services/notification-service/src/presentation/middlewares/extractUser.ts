import { Request, Response, NextFunction } from "express";
 
export const extractUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers["x-user-id"] as string;
  const userEmail = req.headers["x-user-email"] as string;
  const userRole = req.headers["x-user-role"] as string;
 
  if (userId) {
    // reconstruct the user object from gateway-forwarded headers
    // this mirrors what gateway's verifyToken sets on (req as any).user
    (req as any).user = {
      id: userId,
      userId: userId, // some code uses .userId, some uses .id — support both
      email: userEmail,
      role: userRole,
    };
  }
 
  // always call next() — authentication was already done at the gateway.
  // the notification service does not need to re-verify the JWT.
  next();
};