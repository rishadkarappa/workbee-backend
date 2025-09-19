import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'gwtSecret'

export class TokenService {
    generate(id:string):string {
        return jwt.sign({id}, JWT_SECRET, {expiresIn:'7d'})
    }
}
