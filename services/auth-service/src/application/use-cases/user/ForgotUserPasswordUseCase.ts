import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { TokenService } from "../../../infrastructure/services/TokenService";
import { EmailService } from "../../../infrastructure/services/EmailService";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";

@injectable()
export class ForgotPasswordUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository,
        private tokenService:TokenService,
        private emailService:EmailService
    ){}

    async execute(email:string){
        const user = await this.userRepository.findByEmail(email)
        if(!user) throw new Error(ErrorMessages.USER.NOT_FOUND)
        // console.log('forgot pass usecase get user')
        const resetToken = this.tokenService.generate(user.id!)
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        await this.emailService.sendResentPasswordLink(email, resetLink)

        return { message: ResponseMessage.USER.SENT_RESET_LINK}
    }
}
