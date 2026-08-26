import { Review } from "../entities/Review";

export interface IReviewRepository {
  create(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review>;
  findByWorkId(workId: string): Promise<Review | null>;
  findByWorkerId(workerId: string, page?: number, limit?: number): Promise<{ reviews: Review[]; total: number }>;
  getWorkerStats(workerId: string): Promise<{ avgRating: number; totalReviews: number }>;
}