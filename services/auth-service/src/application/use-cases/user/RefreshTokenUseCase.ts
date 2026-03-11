import { injectable, inject } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { IRefreshTokenUseCase } from "../../ports/user/IRefreshTokenUseCase";
import { RefreshTokenRequestDTO, RefreshTokenResponseDTO } from "../../dtos/user/RefreshTokenDTO";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("TokenService") private _tokenService: ITokenService
  ) {}

  async execute(data: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
    const { refreshToken } = data;

    // Step 1: Verify the refresh token signature
    let payload: { id: string; role?: string };
    try {
      payload = this._tokenService.verifyRefresh(refreshToken);
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.INVALID_REFRESH_TOKEN);
    }

    const userId = payload.id;
    const role = payload.role;

    // Step 2: Validate token exists in Redis
    // This works for ALL roles (user, worker, admin) because we store by userId
    const isValid = await this._tokenService.validateRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new Error(ErrorMessages.AUTH.REFRESH_TOKEN_NOT_FOUND);
    }

    // Step 3: Verify the entity still exists and is active
    // Workers live in a separate service/DB — we cannot query them from auth service.
    // For workers: Redis validation above is sufficient proof they are authenticated.
    // For users/admins: also check the local users collection.
    if (role === "user" || role === "admin") {
      const user = await this._userRepository.findById(userId);
      if (!user) throw new Error(ErrorMessages.USER.NOT_FOUND);
      if (!user.isVerified) throw new Error(ErrorMessages.USER.NOT_VERIFIED);
      if (user.isBlocked) throw new Error("User is blocked");
    }
    // Workers: Redis token presence is the auth check.
    // If the worker was deactivated, their Redis token should be deleted
    // by the worker service (call _tokenService.deleteRefreshToken on block/deactivate).

    // Step 4: Generate new tokens
    const newAccessToken = this._tokenService.generateAccess(
      userId,
      role as "user" | "admin" | "worker"
    );

    const newRefreshToken = this._tokenService.generateRefresh(
      userId,
      role as "user" | "admin" | "worker"
    );

    // Step 5: Rotate refresh token in Redis
    await this._tokenService.storeRefreshToken(userId, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}