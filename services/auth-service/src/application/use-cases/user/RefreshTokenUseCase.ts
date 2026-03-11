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

    // Step 2: Validate token exists in Redis (works for ALL roles)
    const isValid = await this._tokenService.validateRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new Error(ErrorMessages.AUTH.REFRESH_TOKEN_NOT_FOUND);
    }

    // Step 3: Role-based entity validation
    if (role === "user") {
      // Regular users: check they exist, are verified, and not blocked
      const user = await this._userRepository.findById(userId);
      if (!user) throw new Error(ErrorMessages.USER.NOT_FOUND);
      if (!user.isVerified) throw new Error(ErrorMessages.USER.NOT_VERIFIED);
      if (user.isBlocked) throw new Error("User is blocked");

    } else if (role === "admin") {
      // Admins: only verify they still exist in the DB.
      // Admins are NEVER subject to isBlocked checks — blocking an admin
      // through the user block flow would lock out the entire system.
      const admin = await this._userRepository.findById(userId);
      if (!admin) throw new Error(ErrorMessages.USER.NOT_FOUND);

    } else if (role === "worker") {
      // Workers live in a separate service DB — no DB lookup possible here.
      // Redis token presence (step 2) is the auth check.
      // Workers are invalidated by deleting their Redis token in BlockWorkerUseCase.
    }

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