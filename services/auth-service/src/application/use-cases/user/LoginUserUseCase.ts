import { injectable, inject } from "tsyringe";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { LoginUserRequestDTO, LoginUserResponseDTO } from "../../dtos/user/LoginUserDTO";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { IHashService } from "../../../domain/services/IHashService";
import { UserMapper } from "../../mappers/UserMapper";
import { ILoginUserUseCase } from "../../ports/user/ILoginUserUseCase";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("HashService") private _hashService: IHashService,
    @inject("TokenService") private _tokenService: ITokenService
  ) { }

  async execute(data: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
    const { email, password } = data;

    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new Error(ErrorMessages.USER.NOT_FOUND);

    const isMatch = await this._hashService.compare(password, user.password!);
    if (!isMatch) throw new Error(ErrorMessages.USER.INVALID_PASSWORD);

    if (user.isBlocked) {
      throw new Error("user wasw blocked")
    }

    // Generate both tokens
    const accessToken = this._tokenService.generateAccess(user.id!, user.role as "user" | "admin" | "worker");
    const refreshToken = this._tokenService.generateRefresh(user.id!, user.role as "user" | "admin" | "worker");

    // Store refresh token in Redis
    await this._tokenService.storeRefreshToken(user.id!, refreshToken);

    return UserMapper.toLoginResponse(user, accessToken, refreshToken);
  }
}