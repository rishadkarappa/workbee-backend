import { Request, Response, NextFunction } from "express";
import { UserRole } from "@workbee/common";
 
export const extractUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers["x-user-id"] as string;
  const userEmail = req.headers["x-user-email"] as string;
  const userRole = req.headers["x-user-role"] as UserRole | undefined;
 
  if (userId && userEmail && userRole) {
    req.user = {
      userId,
      email: userEmail,
      role: userRole,
    };
  }

  next();
};