import { WorkerStatus } from "../../../infrastructure/database/models/WorkerSchema";

export interface UpdateWorkerProfileReqDTO {
  userId: string;
  name: string;
  phone: string;
  location: string;
  bio: string;
}

export interface WorkerProfileResponseDTO {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    workType: string;
    preferredWorks: string[];
    bio?: string;
    workerProfileImage?: string;
    status: WorkerStatus;
    createdAt?: Date;
    updatedAt?: Date;
}