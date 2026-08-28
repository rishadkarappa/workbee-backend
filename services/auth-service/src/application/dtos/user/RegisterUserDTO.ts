export interface RegisterUserRequestDTO {
  name: string;
  email: string;
  phone:string;
  password: string;
}

export interface RegisterUserResponseDTO {
  userId: string;
  message: string;
}
