import { injectable } from "tsyringe";
import { IReviewRepository } from "../../../domain/repositories/IReviewRepository";
import { Review } from "../../../domain/entities/Review";
import { ReviewModel, ReviewDocument } from "../models/ReviewSchema";

@injectable()
export class MongoReviewRepository implements IReviewRepository {
  private map(doc: ReviewDocument): Review {
    return {
      id: doc._id.toString(),
      workId: doc.workId,
      workerId: doc.workerId,
      userId: doc.userId,
      rating: doc.rating,
      testimonial: doc.testimonial,
      createdAt: doc.createdAt,
    };
  }

  async create(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const created = await ReviewModel.create(review);
    return this.map(created);
  }

  async findByWorkId(workId: string): Promise<Review | null> {
    const doc = await ReviewModel.findOne({ workId });
    return doc ? this.map(doc) : null;
  }

  async findByWorkerId(workerId: string, page = 1, limit = 10): Promise<{ reviews: Review[]; total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      ReviewModel.find({ workerId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ReviewModel.countDocuments({ workerId }),
    ]);
    return { reviews: docs.map(d => this.map(d)), total };
  }

  async getWorkerStats(workerId: string): Promise<{ avgRating: number; totalReviews: number }> {
    const result = await ReviewModel.aggregate([
      { $match: { workerId } },
      { $group: { _id: "$workerId", avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
    ]);
    if (result.length === 0) return { avgRating: 0, totalReviews: 0 };
    return { avgRating: Math.round(result[0].avgRating * 10) / 10, totalReviews: result[0].totalReviews };
  }
}