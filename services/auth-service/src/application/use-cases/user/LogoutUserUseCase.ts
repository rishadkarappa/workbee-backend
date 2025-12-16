import { injectable, inject } from "tsyringe";
import { ITokenService } from "../../../domain/services/ITokenService";
import { ILogoutUserUseCase } from "../../ports/user/ILogoutUserUseCase";

@injectable()
export class LogoutUserUseCase implements ILogoutUserUseCase {
  constructor(
    @inject("TokenService") private _tokenService: ITokenService
  ) {}

  async execute(userId: string): Promise<void> {
    // Delete refresh token from Redis
    await this._tokenService.deleteRefreshToken(userId);
  }
}
