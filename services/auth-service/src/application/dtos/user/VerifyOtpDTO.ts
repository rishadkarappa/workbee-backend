export interface VerifyOtpRequestDTO {
  userId: string;
  otp: string;
}

export interface VerifyOtpResponseDTO {
  user: any;
  accessToken: string;
  refreshToken: string;
}