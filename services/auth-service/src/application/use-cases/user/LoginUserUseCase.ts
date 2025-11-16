// import { injectable,inject } from "tsyringe";
// import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

// import { IUserRepository } from "../../../domain/repositories/IUserRepository";
// import { ITokenService } from "../../../domain/services/ITokenService";
// import { IHashService } from "../../../domain/services/IHashService";

// @injectable()
// export class LoginUserUseCase {
//   constructor(
//     @inject("UserRepository") private userRepository:IUserRepository,
//     @inject("HashService") private hashService:IHashService,
//     @inject("TokenService") private tokenService:ITokenService
//   ) {}
  
  
//   async execute(email:string, password:string) {
//     // console.log('hited loginuse case');
//     // logger.info('hited login case')
//     const user = await this.userRepository.findByEmail(email)
//     if(!user) throw new Error(ErrorMessages.USER.NOT_FOUND)
    
//     const isMatch = await this.hashService.compare(password, user.password!)
//     if(!isMatch) throw new Error(ErrorMessages.USER.INVALID_PASSWORD)

//     const token = this.tokenService.generate(user.id!)
//     return {user, token}
//   }
// }


import { injectable, inject } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

import { LoginUserRequestDTO, LoginUserResponseDTO } from "../../dtos/user/LoginUserDTO";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { IHashService } from "../../../domain/services/IHashService";

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("HashService") private hashService: IHashService,
    @inject("TokenService") private tokenService: ITokenService
  ) { }

  async execute(data: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
    // console.log('hited loginuse case');
    // logger.info('hited login case')
    const {email, password} = data
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new Error(ErrorMessages.USER.NOT_FOUND)

    const isMatch = await this.hashService.compare(password, user.password!)
    if (!isMatch) throw new Error(ErrorMessages.USER.INVALID_PASSWORD)

    const token = this.tokenService.generate(user.id!)
    return { user, token }
  }
}

