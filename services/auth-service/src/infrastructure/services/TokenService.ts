import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';

import { ITokenService } from '../../domain/services/ITokenService';

import RedisClient from '../config/RedisClient';
import { ENV } from '../config/env';
import { AUTH_CONFIG } from '../config/auth.config';

import { ErrorMessages } from '../../shared/constants/ErrorMessages';
import { UserRoles } from '../../shared/constants/UserRoles';

@injectable()
export class TokenService implements ITokenService {
    private redis = RedisClient.getInstance();

    generateAccess(id: string, role?: UserRoles): string {
        const payload = role ? { id, role } : { id };
        return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRY });
    }

    generateRefresh(id: string, role?: UserRoles): string {
        const payload = role ? { id, role } : { id };
        return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRY });
    }

    verifyAccess(token: string): { id: string; role?: string } {
        try {
            const payload = jwt.verify(token, ENV.JWT_SECRET) as { id: string; role?: string };
            return payload;
        } catch (error) {
            throw new Error(ErrorMessages.AUTH.INVALID_OR_EXPIRED_ACCESS_TOKEN);
        }
    }

    verifyRefresh(token: string): { id: string; role?: string } {
        try {
            const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET) as { id: string; role?: string };
            return payload;
        } catch (error) {
            throw new Error(ErrorMessages.AUTH.INVALID_OR_EXPIRED_ACCESS_TOKEN);
        }
    }

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