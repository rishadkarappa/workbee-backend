import { AuthenticatedUserDTO } from "./AuthenticatedUserDTO";

export interface LoginUserRequestDTO {
  email: string;
  password: string;
}

export interface LoginUserResponseDTO {
  user: AuthenticatedUserDTO;
  accessToken: string;
  refreshToken: string;
}