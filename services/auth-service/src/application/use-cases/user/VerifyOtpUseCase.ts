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
        @inject("UserRepository") private _userRepository: IUserRepository,
        @inject("OtpRepository") private _otpRepository: IOtpRepository,
        @inject("TokenService") private _tokenService: ITokenService
    ) {}

    async execute(data: VerifyOtpRequestDTO): Promise<VerifyOtpResponseDTO> {
        const { userId, otp } = data;
        const otpRecord = await this._otpRepository.findByUserId(userId);
        if (!otpRecord) throw new Error(ErrorMessages.USER.DONT_GET_OTP);
        if (otpRecord.otp !== otp) throw new Error(ErrorMessages.USER.INVALID_OTP);
        if (otpRecord.expiresAt < new Date()) throw new Error(ErrorMessages.USER.OTP_EXPIRED);
        
        await this._otpRepository.deleteByUserId(userId);

        const user = await this._userRepository.findById(userId);
        if (!user) throw new Error(ErrorMessages.GENERAL.NOT_FOUND_OTP);

        user.isVerified = true;
        await this._userRepository.save(user);
        
        // Generate both access and refresh tokens
        const accessToken = this._tokenService.generateAccess(user.id!, user.role as "user" | "admin" | "worker");
        const refreshToken = this._tokenService.generateRefresh(user.id!, user.role as "user" | "admin" | "worker");

        // Store refresh token in Redis
        await this._tokenService.storeRefreshToken(user.id!, refreshToken);

        return UserMapper.toVerifyOtpResponse(user, accessToken, refreshToken);
    }
}