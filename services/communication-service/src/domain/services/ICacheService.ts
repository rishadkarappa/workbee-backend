import { UserProfile, WorkerProfile } from "../entities/Profile";

export interface ICacheService {
  getUserProfile(userId: string): Promise<UserProfile | null>;
  getWorkerProfile(workerId: string): Promise<WorkerProfile | null>;

  invalidateUserProfile(userId: string): void;
  invalidateWorkerProfile(workerId: string): void;
}
