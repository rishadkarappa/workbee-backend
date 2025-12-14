import { RefreshTokenRequestDTO, RefreshTokenResponseDTO } from "../../dtos/user/RefreshTokenDTO";

export interface IRefreshTokenUseCase {
  execute(data: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO>;
}