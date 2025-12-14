export interface GoogleLoginRequestDTO {
  credential: string;
}

export interface GoogleLoginResponseDTO {
  user: any;
  accessToken: string;
  refreshToken: string;
}