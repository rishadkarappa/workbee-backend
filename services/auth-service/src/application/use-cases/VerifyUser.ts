import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { TokenService } from "../../infrastructure/services/TokenService";

export class VerifyUser{
    constructor(
        private userRepository:IUserRepository,
        private tokenService:TokenService
    ){}
    async execute(token:string){
        const payload = this.tokenService.verify(token)
        const user = this.userRepository.findById(payload.id)
        return user;
    }
}







