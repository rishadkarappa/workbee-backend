import { injectable,inject } from "tsyringe";
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

    const user = await this.userRepository.findByEmail(email)
    if(!user) throw new Error('user does not exist please register')
    
    const isMatch = await this.hashService.compare(password, user.password)
    if(!isMatch) throw new Error('invalid password')

    const token = this.tokenService.generate(user.id!)
    return {user, token}
  }
}

