import { injectable, inject } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { IRefreshTokenUseCase } from "../../ports/user/IRefreshTokenUseCase";
import { RefreshTokenRequestDTO, RefreshTokenResponseDTO } from "../../dtos/user/RefreshTokenDTO";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("TokenService") private tokenService: ITokenService
  ) {}

  async execute(data: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
    const { refreshToken } = data;

    // Verify the refresh token
    let payload;
    try {
      payload = this.tokenService.verifyRefresh(refreshToken);
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.INVALID_REFRESH_TOKEN);
    }

    // Validate token exists in Redis
    const isValid = await this.tokenService.validateRefreshToken(payload.id, refreshToken);
    if (!isValid) {
      throw new Error(ErrorMessages.AUTH.REFRESH_TOKEN_NOT_FOUND);
    }

    // Get user to ensure they still exist and are active
    const user = await this.userRepository.findById(payload.id);
    if (!user) throw new Error(ErrorMessages.USER.NOT_FOUND);
    if (!user.isVerified) throw new Error(ErrorMessages.USER.NOT_VERIFIED);

    // Generate new access token
    const newAccessToken = this.tokenService.generateAccess(
      user.id!,
      user.role as "user" | "admin" | "worker"
    );

    // Optionally: Generate new refresh token and rotate
    const newRefreshToken = this.tokenService.generateRefresh(
      user.id!,
      user.role as "user" | "admin" | "worker"
    );

    // Store new refresh token in Redis (token rotation)
    await this.tokenService.storeRefreshToken(user.id!, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}