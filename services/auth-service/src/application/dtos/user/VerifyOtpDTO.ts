import { AuthenticatedUserDTO } from "./AuthenticatedUserDTO";

export interface VerifyOtpRequestDTO {
  userId: string;
  otp: string;
}

export interface VerifyOtpResponseDTO {
  user: AuthenticatedUserDTO;
  accessToken: string;
  refreshToken: string;
}