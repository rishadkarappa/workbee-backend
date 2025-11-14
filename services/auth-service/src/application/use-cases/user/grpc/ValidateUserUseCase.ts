// import { inject, injectable } from "tsyringe";
// import { IUserRepository } from "../../../../domain/repositories/IUserRepository";

// @injectable()
// export class ValidateUserUseCase {
//     constructor(
//         @inject("UserRepository") private userRepository: IUserRepository
//     ) {}

//     async execute(userId: string): Promise<boolean> {
//         const user = await this.userRepository.findById(userId);
//         return !!user;
//     }
// }