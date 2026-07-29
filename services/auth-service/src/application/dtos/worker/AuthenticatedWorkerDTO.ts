import { UserRole } from "workbee-common";

export interface AuthenticatedWorkerDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole.WORKER;
  location: string;
  workType: string;
  preferredWorks: string[];
  status: string;
}