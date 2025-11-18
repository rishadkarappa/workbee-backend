import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

import { IGetUsersUseCase } from "../../ports/admin/IGetUsersUseCase";


@injectable()
export class GetUsersUseCase implements IGetUsersUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository
    ) {}

    async execute(){
        const users = await this.userRepository.getUsers()
        if(!users) throw new Error('users didnt get in getuserusecase')
        return { users }
    }
}