import { injectable } from 'tsyringe'
import jwt from 'jsonwebtoken'
import { ITokenService } from '../../domain/services/ITokenService'

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233'

@injectable()
export class TokenService implements ITokenService{
    
    generateAccess(id: string, role?: "user" | "admin" | "worker"): string {
        const payload = role ? { id, role } : { id };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    }

    verifyAccess(token: string): { id: string; role?: string } {
        try {
            const payload = jwt.verify(token, JWT_SECRET) as { id: string; role?: string };
            return payload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}
