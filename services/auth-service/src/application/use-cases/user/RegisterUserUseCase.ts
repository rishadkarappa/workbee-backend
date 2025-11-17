// import { injectable,inject } from "tsyringe";
// import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
// import { User } from "../../../domain/entities/User";
// import { RegisterUserRequestDTO, RegisterUserResponseDTO } from "../../dtos/user/RegisterUserDTO";

// import { IUserRepository } from "../../../domain/repositories/IUserRepository";
// import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
// import { IHashService } from "../../../domain/services/IHashService";
// import { IOtpService } from "../../../domain/services/IOtpService";
// import { IEmailService } from "../../../domain/services/IEmailService";

// @injectable()
// export class RegisterUserUseCase {
//   constructor(
//     @inject("UserRepository") private userRepository:IUserRepository,
//     @inject("OtpRepository") private otpRepository:IOtpRepository,
//     @inject("HashService") private hashService:IHashService,
//     @inject("OtpService") private otpService:IOtpService,
//     @inject("EmailService") private emailService:IEmailService
//   ){}

//   async execute(name:string, email:string, password:string) {
//     // console.log('hited apl leyer')
//     const existing = await this.userRepository.findByEmail(email);
//     if(existing&&existing.isVerified) throw new Error(ErrorMessages.USER.ALREADY_EXISTS);

//     const hashed = await this.hashService.hash(password);

//     const user:User = {
//       id:undefined,
//       name,
//       email,
//       password:hashed,
//       role:'user',
//       isVerified:false,
//     };
//     // console.log(user)
//     const savedUser = await this.userRepository.save(user)
    
//     const otp = this.otpService.generateOtp().toString()
//     console.log(otp)
//     const expiresAt = new Date(Date.now() +5*60*1000);
//     await this.otpRepository.save({
//       userId:savedUser.id!,
//       otp,
//       expiresAt
//     });
//     // console.log(savedUser,'nnnnnnnnn');
//     await this.emailService.sendOtp(email, otp)
    
    
//     return {userId:savedUser.id, message:'otp sent to email'}
//   }
// }

import { injectable,inject } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { User } from "../../../domain/entities/User";

import { RegisterUserRequestDTO, RegisterUserResponseDTO } from "../../dtos/user/RegisterUserDTO";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IHashService } from "../../../domain/services/IHashService";
import { IOtpService } from "../../../domain/services/IOtpService";
import { IEmailService } from "../../../domain/services/IEmailService";
import { UserMapper } from "../../mappers/UserMapper";

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject("UserRepository") private userRepository:IUserRepository,
    @inject("OtpRepository") private otpRepository:IOtpRepository,
    @inject("HashService") private hashService:IHashService,
    @inject("OtpService") private otpService:IOtpService,
    @inject("EmailService") private emailService:IEmailService
  ){}

  async execute(data:RegisterUserRequestDTO):Promise<RegisterUserResponseDTO> {
    // console.log('hited apl leyer')
    const { name, email, password } = data;
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
    
        return UserMapper.toRegisterResponse(savedUser.id!);

  }
}
