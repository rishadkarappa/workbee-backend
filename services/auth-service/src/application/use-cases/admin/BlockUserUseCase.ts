import { inject, injectable } from "tsyringe";
import { IBlockUserUseCase } from "../../ports/admin/IBlockUserUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase{
    constructor(
        @inject("UserRepository") private userRepository:IUserRepository
    ){}

    async execute(userId: string): Promise<User> {
        const user = await this.userRepository.findById(userId)

        if(!user) throw new Error("user not found to block")

        user.isBlocked = !user.isBlocked;

        return this.userRepository.save(user)
    }
}