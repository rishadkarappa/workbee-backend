import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { OtpRepository } from "../../infrastructure/database/repositories/OtpRepository";
import { TokenService } from "../../infrastructure/services/TokenService";

export class VerifyOtp {
    constructor(
        private userRepository:IUserRepository,
        private otpRepository:OtpRepository,
        private tokenService:TokenService
    ){}

    async execute(userId:string, otp:string){
        const otpRecord = await this.otpRepository.findByUserId(userId, otp);
        if(!otpRecord) throw new Error('didnt get otp');
        if(otpRecord.otp !== otp) throw new Error('invalid otp')
        if(otpRecord.expiresAt<new Date()) throw new Error("otp expired")
        
        await this.otpRepository.deleteByUserId(userId)

        const user = await this.userRepository.findById(userId)
        if(!user) throw new Error('user not found when sent otp');
        
        const token = this.tokenService.generate(user.id!)

        return {user, token}
    }
}