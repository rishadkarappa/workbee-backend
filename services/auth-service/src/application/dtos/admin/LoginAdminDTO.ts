import { User } from "../../../domain/entities/User";

export interface LoginAdminRequestDTO{
    email:string,
    password:string
}

export interface LoginAdminResponseDTO {
  admin: User;
  token: string;
}