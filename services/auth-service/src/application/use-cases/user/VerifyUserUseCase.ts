import { injectable,inject } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { TokenService } from "../../../infrastructure/services/TokenService";

@injectable()
export class VerifyUserUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository,
        private tokenService:TokenService
    ){}
    async execute(token:string){
        const payload = this.tokenService.verify(token)
        const user = this.userRepository.findById(payload.id)
        return user;
    }
}







