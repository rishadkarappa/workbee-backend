// import { inject, injectable } from "tsyringe";
// import { IBlockUserUseCase } from "../../ports/admin/IBlockUserUseCase";
// import { IUserRepository } from "../../../domain/repositories/IUserRepository";
// import { ITokenService } from "../../../domain/services/ITokenService";
// import { User } from "../../../domain/entities/User";

// @injectable()
// export class BlockUserUseCase implements IBlockUserUseCase {
//   constructor(
//     @inject("UserRepository") private _userRepository: IUserRepository,
//     @inject("TokenService") private _tokenService: ITokenService
//   ) {}

//   async execute(userId: string): Promise<User> {
//     const user = await this._userRepository.findById(userId);
//     if (!user) throw new Error("User not found to block");

//     // Safety guard: never allow blocking an admin account
//     if (user.role === "admin") {
//       throw new Error("Admin accounts cannot be blocked");
//     }

//     user.isBlocked = !user.isBlocked;
//     const updatedUser = await this._userRepository.save(user);

//     // When blocking: delete refresh token so they're logged out immediately
//     // When unblocking: do nothing — user must log in fresh
//     if (updatedUser.isBlocked) {
//       await this._tokenService.deleteRefreshToken(userId);
//       console.log(`Refresh token deleted for blocked user: ${userId}`);
//     }

//     return updatedUser;
//   }
// }

// auth-service — BlockUserUseCase.ts

import { inject, injectable } from "tsyringe";
import { IBlockUserUseCase } from "../../ports/admin/IBlockUserUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { User } from "../../../domain/entities/User";
import RedisClient from "../../../infrastructure/config/RedisClient";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
  private redis = RedisClient.getInstance();

  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("TokenService") private _tokenService: ITokenService
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
      // 1. Delete refresh token → next refresh attempt fails
      await this._tokenService.deleteRefreshToken(userId);

      // 2. Add to blocklist → gateway rejects ALL requests immediately
      //    TTL matches access token expiry (15 min = 900 seconds)
      //    After 15min the access token is expired anyway, so the key auto-cleans
      await this.redis.setex(`blocked:${userId}`, 900, "1");

      console.log(`User blocked + refresh token deleted + blocklist set: ${userId}`);
    } else {
      // Unblocked — remove from blocklist so they can log in again
      await this.redis.del(`blocked:${userId}`);
      console.log(`User unblocked + removed from blocklist: ${userId}`);
    }

    return updatedUser;
  }
}