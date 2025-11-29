import { LoginUserRequestDTO, LoginUserResponseDTO } from "../../dtos/user/LoginUserDTO";

export interface ILoginUserUseCase {
  execute(data: LoginUserRequestDTO): Promise<LoginUserResponseDTO>;
}
