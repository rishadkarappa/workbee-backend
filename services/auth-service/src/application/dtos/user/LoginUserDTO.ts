export interface LoginUserRequestDTO {
  email: string;
  password: string;
}

export interface LoginUserResponseDTO {
  user: any; 
  accessToken: string;
  refreshToken: string;
}