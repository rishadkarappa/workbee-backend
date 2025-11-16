import { OAuth2Client } from "google-auth-library";
import { User } from "../../../domain/entities/User";
import { inject, injectable } from "tsyringe";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { GoogleLoginRequestDTO, GoogleLoginResponseDTO } from "../../dtos/user/GoogleLoginDTO";

const clientId = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

@injectable()
export class GoogleLoginUserUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository,
        @inject("TokenService") private tokenSerivice:ITokenService
    ){}

    async execute(data:GoogleLoginRequestDTO):Promise<GoogleLoginResponseDTO>{
        const { credential } = data
        const ticket = await clientId.verifyIdToken({
            idToken:credential,
            audience:process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload();
        if(!payload) throw new Error('invalid google credential')

        const { email, name, sub } = payload

        let user = await this.userRepository.findByEmail(email!)

        if(!user){
            const newUser:User = {
                id:undefined,
                name:name||'Google Auth User',
                email:email!,
                isVerified:true,
                role:'user'
            }
            user = await this.userRepository.save(newUser)
        }

        const token =  this.tokenSerivice.generate(user.id!);
        return {user, token}
    }

}
