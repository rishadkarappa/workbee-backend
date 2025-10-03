import { injectable,inject } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { TokenService } from "../../../infrastructure/services/TokenService";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class VerifyUserUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository,
        private tokenService:TokenService
    ){}
    async execute(authHeader?:string){
        if(!authHeader) throw new Error(ErrorMessages.AUTH.ATUH_HEADER_IS_MISSING)

        const token = authHeader.split(" ")[1]
        if(!token) throw new Error(ErrorMessages.USER.TOKEN_IS_MISSING)

        const payload = this.tokenService.verify(token)
        const user = this.userRepository.findById(payload.id)

        if (!user) throw new Error(ErrorMessages.USER.NOT_FOUND);
        return user;
    }
}







