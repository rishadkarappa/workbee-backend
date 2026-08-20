import { UserRole } from "workbee-common";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: UserRole;
  phone?: string;
  countofpost?: number;
  numberOfComplaints?: number;
  userProfileImage?: string;
  userProfileImagePublicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NewUser = Omit<User, "id" | "isBlocked"> & { isBlocked?: boolean }