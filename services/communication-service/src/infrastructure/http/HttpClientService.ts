import axios, { AxiosInstance } from 'axios';
import { injectable } from 'tsyringe';
import { UserProfile, WorkerProfile } from "../../domain/entities/Profile";
import { getErrorMessage } from '@workbee/common';


@injectable()
export class HttpClientService {
  private authServiceClient: AxiosInstance;
  private workServiceClient: AxiosInstance;

  constructor() {
    this.authServiceClient = axios.create({
      baseURL: process.env.AUTH_SERVICE_URL,
      timeout: 5000,
    });

    this.workServiceClient = axios.create({
      baseURL: process.env.WORK_SERVICE_URL,
      timeout: 5000,
    });
  }

  /**
   * communicate with auth service
   * @param userId 
   * @returns 
   */

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await this.authServiceClient.get(`/get-user-profile/${userId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Failed to fetch user profile for ${userId}:`, getErrorMessage(error));
      return null;
    }
  }

  /**
   * communicate with work service
   * @param workerId 
   * @returns 
   */

  async getWorkerProfile(workerId: string): Promise<WorkerProfile | null> {
    try {
      const response = await this.workServiceClient.get(`/get-worker-profile/${workerId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Failed to fetch worker profile for ${workerId}:`, getErrorMessage(error));
      return null;
    }
  }

  /**
   * communicate with user service
   * @param userIds 
   * @returns 
   */

  async getUserProfiles(userIds: string[]): Promise<UserProfile[]> {
    try {
      const response = await this.authServiceClient.post('/get-user-profile/batch', { userIds });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch user profiles batch:', getErrorMessage(error));
      return [];
    }
  }

  /**
   * communicate with work service
   * @param workerIds 
   * @returns 
   */

  async getWorkerProfiles(workerIds: string[]): Promise<WorkerProfile[]> {
    try {
      const response = await this.workServiceClient.post('/get-worker-profile/batch', { workerIds });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch worker profiles batch:', getErrorMessage(error));
      return [];
    }
  }
}