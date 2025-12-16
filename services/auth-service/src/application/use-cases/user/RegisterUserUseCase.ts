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
import { IRegisterUserUseCase } from "../../ports/user/IRegisterUserUseCase";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase{
  constructor(
    @inject("UserRepository") private _userRepository:IUserRepository,
    @inject("OtpRepository") private _otpRepository:IOtpRepository,
    @inject("HashService") private _hashService:IHashService,
    @inject("OtpService") private _otpService:IOtpService,
    @inject("EmailService") private _emailService:IEmailService
  ){}

  async execute(data:RegisterUserRequestDTO):Promise<RegisterUserResponseDTO> {
    // console.log('hited apl leyer')
    const { name, email, password } = data;
    const existing = await this._userRepository.findByEmail(email);
    if(existing&&existing.isVerified) throw new Error(ErrorMessages.USER.ALREADY_EXISTS);

    const hashed = await this._hashService.hash(password);

    const user:User = {
      id:undefined,
      name,
      email,
      password:hashed,
      role:'user',
      isVerified:false,
    };
    // console.log(user)
    const savedUser = await this._userRepository.save(user)
    
    const otp = this._otpService.generateOtp().toString()
    console.log(otp)
    const expiresAt = new Date(Date.now() +5*60*1000);
    await this._otpRepository.save({
      userId:savedUser.id!,
      otp,
      expiresAt
    });
    // console.log(savedUser,'nnnnnnnnn');
    await this._emailService.sendOtp(email, otp)
    
    return UserMapper.toRegisterResponse(savedUser.id!);

  }
}
