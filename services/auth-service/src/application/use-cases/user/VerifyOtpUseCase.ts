import { injectable,inject } from "tsyringe";

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
        if(!otpRecord) throw new Error('didnt get otp');
        if(otpRecord.otp !== otp) throw new Error('invalid otp')
        if(otpRecord.expiresAt<new Date()) throw new Error("otp expired")
        
        await this.otpRepository.deleteByUserId(userId)

        const user = await this.userRepository.findById(userId)
        if(!user) throw new Error('user not found when sent otp');

        user.isVerified = true
        await this.userRepository.save(user)
        
        const token = this.tokenService.generate(user.id!)

        return {user, token}
    }
}