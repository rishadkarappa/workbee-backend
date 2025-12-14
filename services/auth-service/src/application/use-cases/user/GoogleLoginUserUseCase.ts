import { OAuth2Client } from "google-auth-library";
import { User } from "../../../domain/entities/User";
import { inject, injectable } from "tsyringe";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { GoogleLoginRequestDTO, GoogleLoginResponseDTO } from "../../dtos/user/GoogleLoginDTO";
import { UserMapper } from "../../mappers/UserMapper";
import { IGoogleLoginUserUseCase } from "../../ports/user/IGoogleLoginUserUseCase";

const clientId = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

@injectable()
export class GoogleLoginUserUseCase implements IGoogleLoginUserUseCase{
    constructor(
        @inject("UserRepository") private userRepository: IUserRepository,
        @inject("TokenService") private tokenService: ITokenService
    ){}

    async execute(data: GoogleLoginRequestDTO): Promise<GoogleLoginResponseDTO>{
        const { credential } = data;
        const ticket = await clientId.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if(!payload) throw new Error('Invalid google credential');

        const { email, name, sub } = payload;

        let user = await this.userRepository.findByEmail(email!);

        if(!user){
            const newUser: User = {
                id: undefined,
                name: name || 'Google Auth User',
                email: email!,
                isVerified: true,
                role: 'user'
            };
            user = await this.userRepository.save(newUser);
        }

        // Generate both access and refresh tokens
        const accessToken = this.tokenService.generateAccess(user.id!, user.role as "user" | "admin" | "worker");
        const refreshToken = this.tokenService.generateRefresh(user.id!, user.role as "user" | "admin" | "worker");

        // Store refresh token in Redis
        await this.tokenService.storeRefreshToken(user.id!, refreshToken);

        return UserMapper.toGoogleLoginResponse(user, accessToken, refreshToken);
    }
}