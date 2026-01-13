import NodeCache from 'node-cache';
import { inject, injectable } from 'tsyringe';
import { HttpClientService, UserProfile, WorkerProfile } from '../http/HttpClientService';

@injectable()
export class CacheService {
  private cache: NodeCache;

  constructor(
    @inject('HttpClientService') private httpClient: HttpClientService
  ) {
    // Cache with 1 hour TTL
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
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