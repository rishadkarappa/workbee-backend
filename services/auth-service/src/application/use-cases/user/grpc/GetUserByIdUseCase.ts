import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";

@injectable()
export class GetUserByIdUseCase {
    constructor(
        @inject("UserRepository") private userRepository: IUserRepository
    ) {}

    async execute(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}