import { inject, injectable } from "tsyringe";
import { IBlockUserUseCase } from "../../ports/admin/IBlockUserUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { User } from "../../../domain/entities/User";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("TokenService") private _tokenService: ITokenService
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new Error("User not found to block");

    user.isBlocked = !user.isBlocked;
    const updatedUser = await this._userRepository.save(user);

    // If user was just blocked, immediately invalidate their refresh token
    // so they get logged out on their next request

    if (updatedUser.isBlocked) {
      await this._tokenService.deleteRefreshToken(userId);
      console.log(`Refresh token deleted for blocked user: ${userId}`);
    }

    return updatedUser;
  }
}