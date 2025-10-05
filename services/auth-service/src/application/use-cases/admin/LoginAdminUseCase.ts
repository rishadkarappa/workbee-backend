import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

import { HashService } from "../../../infrastructure/services/HashService";
import { TokenService } from "../../../infrastructure/services/TokenService";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class LoginAdminUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository,
        private hashService:HashService,
        private tokenService:TokenService
    ){}

    async execute(email:string, password:string){
        console.log('adminusecase illkj')
        console.log('emil',email);
        console.log('pln pas',password);
        
        const admin = await this.userRepository.findByEmail(email)
        console.log('admin found',admin)
        console.log('admin hash pas',admin?.password)

        if(!admin||admin.role!=='admin') throw new Error(ErrorMessages.ADMIN.ADMIN_NOT_FOUND);

        const isAdmin = await this.hashService.compare(password, admin.password)
        if(!isAdmin) throw new Error(ErrorMessages.ADMIN.WRONG_PASSWORD)

        const token = this.tokenService.generate(admin.id!)

        return { admin, token}
    }
}




