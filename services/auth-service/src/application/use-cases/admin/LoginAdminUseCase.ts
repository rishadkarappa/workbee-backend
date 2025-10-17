import { inject, injectable } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { UserRoles } from "../../../shared/constants/UserRoles";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../../domain/services/IHashService";
import { ITokenService } from "../../../domain/services/ITokenService";

@injectable()
export class LoginAdminUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository,
        @inject("HashService") private hashService:IHashService,
        @inject("TokenService") private tokenService:ITokenService
    ){}

    async execute(email:string, password:string){
        console.log('adminusecase illkj')
        console.log('emil',email);
        console.log('pln pas',password);
        
        const admin = await this.userRepository.findByEmail(email)
        console.log('admin found',admin)
        console.log('admin hash pas',admin?.password)

        if(!admin||admin.role!==UserRoles.ADMIN) throw new Error(ErrorMessages.ADMIN.ADMIN_NOT_FOUND);

        const isAdmin = await this.hashService.compare(password, admin.password!)
        if(!isAdmin) throw new Error(ErrorMessages.ADMIN.WRONG_PASSWORD)

        const token = this.tokenService.generate(admin.id!)

        return { admin, token}
    }
}




