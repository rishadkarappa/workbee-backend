import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { TokenService } from "../../../infrastructure/services/TokenService";
import { HashService } from "../../../infrastructure/services/HashService";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";


@injectable()
export class ResetPasswordUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository,
        private tokenService:TokenService,
        private hashService:HashService
    ){}

    async execute(token:string, password:string){
        const payload = this.tokenService.verify(token)
        const user = await this.userRepository.findById(payload.id)
        if(!user) throw new Error(ErrorMessages.USER.NOT_FOUND)
        
        const hashed = await this.hashService.hash(password)
        console.log('hased pas',hashed)
        user.password = hashed

        await this.userRepository.save(user)
        return { message:ResponseMessage.USER.PASSOWORD_UPDATED}
    }
}