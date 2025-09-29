import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { HashService } from "../../infrastructure/services/HashService";
import { EmailService } from "../../infrastructure/services/EmailService";
import { OtpService } from "../../infrastructure/services/OtpService";
import { User } from "../../domain/entities/User";

export class RegisterUser {
  constructor(
    private userRepository:IUserRepository,
    private otpRepository:IOtpRepository,
    private hashService:HashService,
    private otpService:OtpService,
    private emailSerivice:EmailService
  ){}

  async execute(fullName:string, email:string, password:string) {
    const existing = await this.userRepository.findByEmail(email);
    if(existing) throw new Error('user already exists');

    const hashed = await this.hashService.hash(password);

    const user:User = {
      id:undefined,
      fullName,
      email,
      password:hashed,
      createdAt:new Date(),
    };

    const savedUser = await this.userRepository.save(user)

    const otp = this.otpService.generateOtp().toString()
    const expiresAt = new Date(Date.now()+5*60*1000);
    await this.otpRepository.save(savedUser.id!, otp, expiresAt);

    await this.emailSerivice.sendOtp(email, otp)

    return {userId:savedUser.id, message:'otp sent to email'}
  }
}
