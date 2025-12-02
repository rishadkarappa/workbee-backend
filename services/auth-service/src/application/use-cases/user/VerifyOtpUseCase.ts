// import { injectable,inject } from "tsyringe";
// import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

// import { IUserRepository } from "../../../domain/repositories/IUserRepository";
// import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
// import { ITokenService } from "../../../domain/services/ITokenService";
// import { VerifyOtpRequestDTO, VerifyOtpResponseDTO } from "../../dtos/user/VerifyOtpDTO";
// import { UserMapper } from "../../mappers/UserMapper";

// import { IVerifyOtpUseCase } from "../../ports/user/IVerifyOtpUseCase";

// @injectable()
// export class VerifyOtpUseCase implements IVerifyOtpUseCase{
//     constructor(
//         @inject("UserRepository") private userRepository:IUserRepository,
//         @inject("OtpRepository") private otpRepository:IOtpRepository,
//         @inject("TokenService") private tokenService:ITokenService
//     ){}

//     async execute(data:VerifyOtpRequestDTO):Promise<VerifyOtpResponseDTO>{
//         const { userId, otp } = data
//         const otpRecord = await this.otpRepository.findByUserId(userId);
//         if(!otpRecord) throw new Error(ErrorMessages.USER.DONT_GET_OTP);
//         if(otpRecord.otp !== otp) throw new Error(ErrorMessages.USER.INVALID_OTP)
//         if(otpRecord.expiresAt<new Date()) throw new Error(ErrorMessages.USER.OTP_EXPIRED)
        
//         await this.otpRepository.deleteByUserId(userId)

//         const user = await this.userRepository.findById(userId)
//         if(!user) throw new Error(ErrorMessages.GENERAL.NOT_FOUND_OTP);

//         user.isVerified = true
//         await this.userRepository.save(user)
        
//         const token = this.tokenService.generateAccess(user.id!)

//         return UserMapper.toVerifyOtpResponse(user, token);

//     }
// }

// application/use-cases/user/VerifyOtpUseCase.ts
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
        
        const token = this.tokenService.generateAccess(user.id!, user.role as "user" | "admin" | "worker");

        return UserMapper.toVerifyOtpResponse(user, token);
    }
}
