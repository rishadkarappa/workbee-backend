import NodeCache from 'node-cache';
import { HttpClientService, UserProfile, WorkerProfile } from '../http/HttpClientService';

export class CacheService {
  private cache: NodeCache;
  private httpClient: HttpClientService;

  constructor() {
    // Cache with 1 hour TTL
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
    this.httpClient = new HttpClientService();
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const cacheKey = `user:${userId}`;
    const cached = this.cache.get<UserProfile>(cacheKey);

    if (cached) {
      return cached;
    }

    const profile = await this.httpClient.getUserProfile(userId);
    if (profile) {
      this.cache.set(cacheKey, profile);
    }
    return profile;
  }

  async getWorkerProfile(workerId: string): Promise<WorkerProfile | null> {
    const cacheKey = `worker:${workerId}`;
    const cached = this.cache.get<WorkerProfile>(cacheKey);

    if (cached) {
      return cached;
    }

    const profile = await this.httpClient.getWorkerProfile(workerId);
    if (profile) {
      this.cache.set(cacheKey, profile);
    }
    return profile;
  }

  invalidateUserProfile(userId: string): void {
    this.cache.del(`user:${userId}`);
  }

  invalidateWorkerProfile(workerId: string): void {
    this.cache.del(`worker:${workerId}`);
  }
}
