import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IGetUsersUseCase } from "../../ports/admin/IGetUsersUseCase";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
    constructor(
        @inject("UserRepository") private readonly _userRepository: IUserRepository
    ) {}

    async execute(page: number, limit: number, search: string, status: string = "all") {
        const result = await this._userRepository.getUsers(page, limit, search, status);
        if (!result) throw new Error(ErrorMessages.USER.NOT_FOUND_USERS);
        return result; 
    }
}