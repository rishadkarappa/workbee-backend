import { injectable, inject } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { VerifyOtpRequestDTO, VerifyOtpResponseDTO } from "../../dtos/user/VerifyOtpDTO";
import { UserMapper } from "../../mappers/UserMapper";

import { IVerifyOtpUseCase } from "../../ports/user/IVerifyOtpUseCase";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
    constructor(
        @inject("UserRepository") private userRepository: IUserRepository,
        @inject("OtpRepository") private otpRepository: IOtpRepository,
        @inject("TokenService") private tokenService: ITokenService
    ) {}

    async execute(data: VerifyOtpRequestDTO): Promise<VerifyOtpResponseDTO> {
        const { userId, otp } = data;
        const otpRecord = await this.otpRepository.findByUserId(userId);
        if (!otpRecord) throw new Error(ErrorMessages.USER.DONT_GET_OTP);
        if (otpRecord.otp !== otp) throw new Error(ErrorMessages.USER.INVALID_OTP);
        if (otpRecord.expiresAt < new Date()) throw new Error(ErrorMessages.USER.OTP_EXPIRED);
        
        await this.otpRepository.deleteByUserId(userId);

        const user = await this.userRepository.findById(userId);
        if (!user) throw new Error(ErrorMessages.GENERAL.NOT_FOUND_OTP);

        user.isVerified = true;
        await this.userRepository.save(user);
        
        // Generate both access and refresh tokens
        const accessToken = this.tokenService.generateAccess(user.id!, user.role as "user" | "admin" | "worker");
        const refreshToken = this.tokenService.generateRefresh(user.id!, user.role as "user" | "admin" | "worker");

        // Store refresh token in Redis
        await this.tokenService.storeRefreshToken(user.id!, refreshToken);

        return UserMapper.toVerifyOtpResponse(user, accessToken, refreshToken);
    }
}