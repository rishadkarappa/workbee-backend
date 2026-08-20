import { inject, injectable } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../../domain/services/IHashService";
import { ITokenService } from "../../../domain/services/ITokenService";

import { LoginAdminRequestDTO, LoginAdminResponseDTO } from "../../dtos/admin/LoginAdminDTO";
import { AdminMapper } from "../../mappers/AdminMapper";

import { ILoginAdminUseCase } from "../../ports/admin/ILoginAdminUseCase";
import { UserRole } from "workbee-common";

@injectable()
export class LoginAdminUseCase implements ILoginAdminUseCase {
    constructor(
        @inject("UserRepository") private readonly _userRepository: IUserRepository,
        @inject("HashService") private readonly _hashService: IHashService,
        @inject("TokenService") private readonly _tokenService: ITokenService
    ) {}

    async execute(data: LoginAdminRequestDTO): Promise<LoginAdminResponseDTO> {
        const { email, password } = data;
        const admin = await this._userRepository.findByEmail(email);
        
        if (!admin || admin.role !== UserRole.ADMIN) throw new Error(ErrorMessages.ADMIN.ADMIN_NOT_FOUND);

        const isPasswordValid = await this._hashService.compare(password, admin.password!);
        if (!isPasswordValid) throw new Error(ErrorMessages.ADMIN.WRONG_PASSWORD);

        // generate access and refresh tokens
        const accessToken = this._tokenService.generateAccess(admin.id!, UserRole.ADMIN);
        const refreshToken = this._tokenService.generateRefresh(admin.id!, UserRole.ADMIN);
        
        // store refresh token in redis
        await this._tokenService.storeRefreshToken(admin.id!, refreshToken);

        return AdminMapper.toLoginResponse(admin, accessToken, refreshToken);
    }
}

