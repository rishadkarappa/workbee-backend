import NodeCache from "node-cache";
import { inject, injectable } from "tsyringe";
import { HttpClientService } from "../http/HttpClientService";
import { ICacheService } from "../../domain/services/ICacheService";
import { UserProfile, WorkerProfile } from "../../domain/entities/Profile";

@injectable()
export class CacheService implements ICacheService {
  private cache: NodeCache;

  constructor(
    @inject("HttpClientService") private httpClient: HttpClientService
  ) {
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const cacheKey = `user:${userId}`;
    const cached = this.cache.get<UserProfile>(cacheKey);

    if (cached) return cached;

    const profile = await this.httpClient.getUserProfile(userId);
    if (profile) this.cache.set(cacheKey, profile);

    return profile;
  }

  async getWorkerProfile(workerId: string): Promise<WorkerProfile | null> {
    const cacheKey = `worker:${workerId}`;
    const cached = this.cache.get<WorkerProfile>(cacheKey);

    if (cached) return cached;

    const profile = await this.httpClient.getWorkerProfile(workerId);
    if (profile) this.cache.set(cacheKey, profile);

    return profile;
  }

  invalidateUserProfile(userId: string): void {
    this.cache.del(`user:${userId}`);
  }

  invalidateWorkerProfile(workerId: string): void {
    this.cache.del(`worker:${workerId}`);
  }
}
