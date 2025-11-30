
export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  isVerified?: boolean;
  isBlocked?:boolean;
  role:"user"|"admin"|"worker";
  createdAt?: Date;
  updatedAt?:Date;
}

