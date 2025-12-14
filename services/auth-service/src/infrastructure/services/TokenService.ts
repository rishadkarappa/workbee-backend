import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { ITokenService } from '../../domain/services/ITokenService';
import RedisClient from '../config/RedisClient';

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'jwtrefreshsecret2233';
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds

@injectable()
export class TokenService implements ITokenService {
    private redis = RedisClient.getInstance();

    generateAccess(id: string, role?: "user" | "admin" | "worker"): string {
        const payload = role ? { id, role } : { id };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' }); // access token in 15 mins
    }

    generateRefresh(id: string, role?: "user" | "admin" | "worker"): string {
        const payload = role ? { id, role } : { id };
        return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' }); // refresh token in 30 days
    }

    verifyAccess(token: string): { id: string; role?: string } {
        try {
            const payload = jwt.verify(token, JWT_SECRET) as { id: string; role?: string };
            return payload;
        } catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }

    verifyRefresh(token: string): { id: string; role?: string } {
        try {
            const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { id: string; role?: string };
            return payload;
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    async storeRefreshToken(userId: string, token: string, expiresIn: number = REFRESH_TOKEN_EXPIRY): Promise<void> {
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