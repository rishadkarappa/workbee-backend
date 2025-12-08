import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

import { IGetUsersUseCase } from "../../ports/admin/IGetUsersUseCase";


@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
    constructor(
        @inject("UserRepository") private userRepository: IUserRepository
    ) {}

    async execute(page: number, limit: number, search: string) {
        const result = await this.userRepository.getUsers(page, limit, search);
        if (!result) throw new Error('users didnt get in getuserusecase');
        return result; 
    }
}