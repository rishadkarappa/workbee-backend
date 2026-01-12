import axios, { AxiosInstance } from 'axios';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user';
}

export interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'worker';
  skills?: string[];
}

export class HttpClientService {
  private authServiceClient: AxiosInstance;
  private workServiceClient: AxiosInstance;

  constructor() {
    this.authServiceClient = axios.create({
      baseURL: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
      timeout: 5000,
    });

    this.workServiceClient = axios.create({
      baseURL: process.env.WORK_SERVICE_URL || 'http://localhost:4002',
      timeout: 5000,
    });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await this.authServiceClient.get(`/auth/get-user-profile/${userId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error(`Failed to fetch user profile for ${userId}:`, error.message);
      return null;
    }
  }

  async getWorkerProfile(workerId: string): Promise<WorkerProfile | null> {
    try {
      const response = await this.workServiceClient.get(`/work/get-worker-profile/${workerId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error(`Failed to fetch worker profile for ${workerId}:`, error.message);
      return null;
    }
  }

  async getUserProfiles(userIds: string[]): Promise<UserProfile[]> {
    try {
      const response = await this.authServiceClient.post('/auth/get-user-profile/batch', { userIds });
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Failed to fetch user profiles batch:', error.message);
      return [];
    }
  }

  async getWorkerProfiles(workerIds: string[]): Promise<WorkerProfile[]> {
    try {
      const response = await this.workServiceClient.post('/work/get-worker-profile/batch', { workerIds });
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Failed to fetch worker profiles batch:', error.message);
      return [];
    }
  }
}
