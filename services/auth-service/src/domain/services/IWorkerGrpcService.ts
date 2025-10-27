export interface WorkerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  workType: string;
  preferredWorks: string[];
  isApproved: boolean;
}

export interface IWorkerGrpcService {
  validateWorkerCredentials(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    worker: WorkerData | null;
  }>;
}