import { injectable,inject } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { HashService } from "../../../infrastructure/services/HashService";
import { TokenService } from "../../../infrastructure/services/TokenService";

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject("UserRepository") private userRepository:IUserRepository,
    private hashService:HashService,
    private tokenService:TokenService
  ) {}
  
  
  async execute(email:string, password:string) {
    // console.log('hited loginuse case');
    // logger.info('hited login case')
    const user = await this.userRepository.findByEmail(email)
    if(!user) throw new Error(ErrorMessages.USER.NOT_FOUND)
    
    const isMatch = await this.hashService.compare(password, user.password!)
    if(!isMatch) throw new Error(ErrorMessages.USER.INVALID_PASSWORD)

    const token = this.tokenService.generate(user.id!)
    return {user, token}
  }
}

