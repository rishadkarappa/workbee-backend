import { User } from "../../../domain/entities/User";

export interface LoginAdminRequestDTO {
  email: string;
  password: string;
}

export interface LoginAdminResponseDTO {
  user: { 
    id: string;
    _id: string;
    name?: string;
    email: string;
    role: string;
  };
  token: string;
}