export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
  refreshToken: string;
}
