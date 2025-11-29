// import { injectable } from 'tsyringe'
// import jwt from 'jsonwebtoken'

// import { ITokenService } from '../../domain/services/ITokenService'

// const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233'

// @injectable()
// export class TokenService implements ITokenService{
    
//     generate(id:string):string {
//         return jwt.sign({id}, JWT_SECRET, {expiresIn:'7d'})
//     }

//     verify(token:string):{id:string} {
//         try {
//             const payLoad = jwt.verify(token, JWT_SECRET) as { id:string}
//             return payLoad
//         } catch (error) {
//             throw new Error('Invlid or expired token')
//         }
//     }
// }

import { injectable } from 'tsyringe'
import jwt from 'jsonwebtoken'
import { ITokenService } from '../../domain/services/ITokenService'

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233'

@injectable()
export class TokenService implements ITokenService{
    
    // Updated to include role
    generate(id: string, role?: "user" | "admin" | "worker"): string {
        const payload = role ? { id, role } : { id };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    }

    verify(token: string): { id: string; role?: string } {
        try {
            const payload = jwt.verify(token, JWT_SECRET) as { id: string; role?: string };
            return payload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}
