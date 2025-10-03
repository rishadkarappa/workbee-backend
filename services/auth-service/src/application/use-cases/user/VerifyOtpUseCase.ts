import { injectable,inject } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";

import { TokenService } from "../../../infrastructure/services/TokenService";

@injectable()
export class VerifyOtpUseCase {
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository,
        @inject("OtpRepository") private otpRepository:IOtpRepository,
        private tokenService:TokenService
    ){}

    async execute(userId:string, otp:string){
        const otpRecord = await this.otpRepository.findByUserId(userId);
        if(!otpRecord) throw new Error(ErrorMessages.USER.DONT_GET_OTP);
        if(otpRecord.otp !== otp) throw new Error(ErrorMessages.USER.INVALID_OTP)
        if(otpRecord.expiresAt<new Date()) throw new Error(ErrorMessages.USER.OTP_EXPIRED)
        
        await this.otpRepository.deleteByUserId(userId)

        const user = await this.userRepository.findById(userId)
        if(!user) throw new Error(ErrorMessages.GENERAL.NOT_FOUND_OTP);

        user.isVerified = true
        await this.userRepository.save(user)
        
        const token = this.tokenService.generate(user.id!)

        return {user, token}
    }
}