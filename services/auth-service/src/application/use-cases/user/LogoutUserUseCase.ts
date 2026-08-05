import { injectable, inject } from "tsyringe";
import { ITokenService } from "../../../domain/services/ITokenService";
import { ILogoutUserUseCase } from "../../ports/user/ILogoutUserUseCase";
import { logger } from "../../../infrastructure/logger/logger";

@injectable()
export class LogoutUserUseCase implements ILogoutUserUseCase {
  constructor(
    @inject("TokenService") private readonly _tokenService: ITokenService
  ) {}

  async execute(userId: string): Promise<void> {
    // delete refresh token from redis
    logger.info('deleted refreshtoken when logout')
    await this._tokenService.deleteRefreshToken(userId);
  }
}
