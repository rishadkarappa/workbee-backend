import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../../infrastructure/config/env';
import { IJwtPayload } from '@workbee/common';
import { ErrorMessage } from '../../shared/constants/ErrorMessages';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: ErrorMessage.AUTH.NO_TOKEN_PROVIDED
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as IJwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: ErrorMessage.AUTH.INVALID_OR_EXPIRED_TOKEN
    });
  }
};