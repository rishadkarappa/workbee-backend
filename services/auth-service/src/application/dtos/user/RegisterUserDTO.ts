export interface RegisterUserRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface RegisterUserResponseDTO {
  userId: string;
  message: string;
}
