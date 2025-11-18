import { GoogleLoginRequestDTO, GoogleLoginResponseDTO } from "../../dtos/user/GoogleLoginDTO";

export interface IGoogleLoginUserUseCase {
  execute(data: GoogleLoginRequestDTO): Promise<GoogleLoginResponseDTO>;
}
