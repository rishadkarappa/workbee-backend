import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";


@injectable()
export class GetUsersUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository
    ) {}

    async execute(){
        const users = await this.userRepository.getUsers()
        if(!users) throw new Error('users didnt get in getuserusecase')
        return { users }
    }
}