import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { IJwtPayload, UserRole } from "workbee-common";
import { ITokenService } from '../../domain/services/ITokenService';

import RedisClient from '../config/RedisClient';
import { ENV } from '../config/env';
import { AUTH_CONFIG } from '../config/auth.config';

import { ErrorMessages } from '../../shared/constants/ErrorMessages';

@injectable()
export class TokenService implements ITokenService {
    private redis = RedisClient.getInstance();

    generateAccess(userId: string, role?: UserRole): string {
        const payload = role ? { userId, role } : { userId };

        return jwt.sign(payload, ENV.JWT_SECRET, {
            expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRY
        });
    }

    generateRefresh(userId: string, role?: UserRole): string {
        const payload = role ? { userId, role } : { userId };

        return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
            expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRY
        });
    }

    verifyAccess(token: string): IJwtPayload {
        try {
            return jwt.verify(token, ENV.JWT_SECRET) as IJwtPayload;
        } catch {
            throw new Error(ErrorMessages.AUTH.INVALID_OR_EXPIRED_ACCESS_TOKEN);
        }
    }

    verifyRefresh(token: string): IJwtPayload {
        try {
            return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as IJwtPayload;
        } catch {
            throw new Error(ErrorMessages.AUTH.INVALID_OR_EXPIRED_ACCESS_TOKEN);
        }
    }

    // redis

    async storeRefreshToken(userId: string, token: string, expiresIn: number = AUTH_CONFIG.REFRESH_TOKEN_TTL): Promise<void> {
        const key = `refresh_token:${userId}`;
        await this.redis.setex(key, expiresIn, token);
    }

    async getRefreshToken(userId: string): Promise<string | null> {
        const key = `refresh_token:${userId}`;
        return await this.redis.get(key);
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        const key = `refresh_token:${userId}`;
        await this.redis.del(key);
    }

    async validateRefreshToken(userId: string, token: string): Promise<boolean> {
        const storedToken = await this.getRefreshToken(userId);
        return storedToken === token;
    }

}