export interface AuthenticatedWorkerDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "worker";
  location: string;
  workType: string;
  preferredWorks: string[];
  status: string;
}