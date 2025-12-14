import { inject, injectable } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { UserRoles } from "../../../shared/constants/UserRoles";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../../domain/services/IHashService";
import { ITokenService } from "../../../domain/services/ITokenService";

import { LoginAdminRequestDTO, LoginAdminResponseDTO } from "../../dtos/admin/LoginAdminDTO";
import { AdminMapper } from "../../mappers/AdminMapper";

import { ILoginAdminUseCase } from "../../ports/admin/ILoginAdminUseCase";

@injectable()
export class LoginAdminUseCase implements ILoginAdminUseCase {
    constructor(
        @inject("UserRepository") private userRepository: IUserRepository,
        @inject("HashService") private hashService: IHashService,
        @inject("TokenService") private tokenService: ITokenService
    ) {}

    async execute(data: LoginAdminRequestDTO): Promise<LoginAdminResponseDTO> {
        const { email, password } = data;

        const admin = await this.userRepository.findByEmail(email);
        
        if (!admin || admin.role !== UserRoles.ADMIN) {
            throw new Error(ErrorMessages.ADMIN.ADMIN_NOT_FOUND);
        }

        const isPasswordValid = await this.hashService.compare(password, admin.password!);
        if (!isPasswordValid) {
            throw new Error(ErrorMessages.ADMIN.WRONG_PASSWORD);
        }

        // ✅ Generate both access and refresh tokens
        const accessToken = this.tokenService.generateAccess(admin.id!, "admin");
        const refreshToken = this.tokenService.generateRefresh(admin.id!, "admin");

        // ✅ Store refresh token in Redis
        await this.tokenService.storeRefreshToken(admin.id!, refreshToken);

        return AdminMapper.toLoginResponse(admin, accessToken, refreshToken);
    }
}

