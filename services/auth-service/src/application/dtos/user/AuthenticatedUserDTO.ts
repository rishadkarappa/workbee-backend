import { UserRole } from "workbee-common";

export interface AuthenticatedUserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  isVerified: boolean;
}