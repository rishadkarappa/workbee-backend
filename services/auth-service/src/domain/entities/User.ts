export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  isVerified?: boolean;
  role:"user"|"admin";
  createdAt?: Date;
  updatedAt?:Date;
}
