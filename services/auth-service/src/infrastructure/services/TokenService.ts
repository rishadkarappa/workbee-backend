import { injectable } from 'tsyringe'
import jwt from 'jsonwebtoken'

import { ITokenService } from '../../domain/services/ITokenService'

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233'

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

// import { injectable } from 'tsyringe'
// import jwt from 'jsonwebtoken'

// import { ITokenService } from '../../domain/services/ITokenService'

// const JWT_SECRET = process.env.JWT_SECRET!
// const REFRESH_SECRET = process.env.REFRESH_SECRET!

// @injectable()
// export class TokenService implements ITokenService{
//     generateAccess(id:string){
//         return jwt.sign({id}, JWT_SECRET, { expiresIn: "30m"})
//     }

//     generateRefresh(id:string){
//         return jwt.sign({id}, REFRESH_SECRET, { expiresIn: "7d"})
//     }

//     verifyAccess(token: string) {
//         return jwt.verify(token, JWT_SECRET) as { id: string}
//     }

//     verifyRefresh(token:string) {
//         return jwt.verify(token, REFRESH_SECRET) as { id:string}
//     }
// }
