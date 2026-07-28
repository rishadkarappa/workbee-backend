import { UserRole } from "@workbee/common";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole.USER;
}

export interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole.WORKER;
  skills?: string[];
}