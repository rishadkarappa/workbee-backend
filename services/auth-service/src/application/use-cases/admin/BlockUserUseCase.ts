import { inject, injectable } from "tsyringe";
import { IBlockUserUseCase } from "../../ports/admin/IBlockUserUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { User } from "../../../domain/entities/User";
import RedisClient from "../../../infrastructure/config/RedisClient";
import { logger } from "../../../infrastructure/logger/logger";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
  private redis = RedisClient.getInstance();

  constructor(
    @inject("UserRepository") private readonly _userRepository: IUserRepository,
    @inject("TokenService") private readonly _tokenService: ITokenService
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new Error("User not found to block");

    if (user.role === "admin") {
      throw new Error("Admin accounts cannot be blocked");
    }

    user.isBlocked = !user.isBlocked;
    const updatedUser = await this._userRepository.save(user);

    if (updatedUser.isBlocked) {
      await this._tokenService.deleteRefreshToken(userId);
      await this.redis.setex(`blocked:${userId}`, 900, "1");

      logger.info(`User blocked + refresh token deleted + blocklist set: ${userId}`);
    } else {
      await this.redis.del(`blocked:${userId}`);
      logger.info(`User unblocked + removed from blocklist: ${userId}`);
    }

    return updatedUser;
  }
}