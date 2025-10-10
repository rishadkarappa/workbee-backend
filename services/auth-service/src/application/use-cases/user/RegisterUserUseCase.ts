import { injectable,inject } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { HashService } from "../../../infrastructure/services/HashService";
import { EmailService } from "../../../infrastructure/services/EmailService";
import { OtpService } from "../../../infrastructure/services/OtpService";
import { User } from "../../../domain/entities/User";

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject("UserRepository") private userRepository:IUserRepository,
    @inject("OtpRepository") private otpRepository:IOtpRepository,
    private hashService:HashService,
    private otpService:OtpService,
    private emailService:EmailService
  ){}

  async execute(name:string, email:string, password:string) {
    // console.log('hited apl leyer')
    const existing = await this.userRepository.findByEmail(email);
    if(existing&&existing.isVerified) throw new Error(ErrorMessages.USER.ALREADY_EXISTS);

    const hashed = await this.hashService.hash(password);

    const user:User = {
      id:undefined,
      name,
      email,
      password:hashed,
      role:'user',
      isVerified:false,
    };
    // console.log(user)
    const savedUser = await this.userRepository.save(user)
    
    const otp = this.otpService.generateOtp().toString()
    console.log(otp)
    const expiresAt = new Date(Date.now() +5*60*1000);
    await this.otpRepository.save({
      userId:savedUser.id!,
      otp,
      expiresAt
    });
    // console.log(savedUser,'nnnnnnnnn');
    await this.emailService.sendOtp(email, otp)
    
    
    return {userId:savedUser.id, message:'otp sent to email'}
  }
}
