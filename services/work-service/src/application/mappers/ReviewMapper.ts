import { Review } from "../../domain/entities/Review";
import { ReviewResponseDto } from "../dtos/review/ReviewDTO";

export class ReviewMapper {
  static toResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      workId: review.workId,
      workerId: review.workerId,
      rating: review.rating,
      testimonial: review.testimonial,
      createdAt: review.createdAt,
    };
  }
}