import { AuthenticatedUserDTO } from "./AuthenticatedUserDTO";

export interface GoogleLoginRequestDTO {
  credential: string;
}

export interface GoogleLoginResponseDTO {
  user: AuthenticatedUserDTO;
  accessToken: string;
  refreshToken: string;
}
