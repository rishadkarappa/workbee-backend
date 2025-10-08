import { injectable } from 'tsyringe'
import jwt from 'jsonwebtoken'

import { ITokenService } from '../../domain/services/ITokenService'

const JWT_SECRET = process.env.JWT_SECRET || 'gwtSecret'

@injectable()
export class TokenService implements ITokenService{
    
    generate(id:string):string {
        return jwt.sign({id}, JWT_SECRET, {expiresIn:'7d'})
    }

    verify(token:string):{id:string} {
        try {
            const payLoad = jwt.verify(token, JWT_SECRET) as { id:string}
            return payLoad
        } catch (error) {
            throw new Error('Invlid or expired token')
        }
    }
}
