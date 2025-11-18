export interface GoogleLoginRequestDTO {
  credential: string;
}

export interface GoogleLoginResponseDTO {
  user: any;
  token: string;
}
