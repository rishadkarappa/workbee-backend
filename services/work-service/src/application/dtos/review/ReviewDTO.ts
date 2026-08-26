export interface CreateReviewDto {
  workId: string;
  workerId: string;
  userId: string;
  rating: number;
  testimonial?: string;
}

export interface ReviewResponseDto {
  id: string;
  workId: string;
  workerId: string;
  rating: number;
  testimonial?: string;
  createdAt: Date;
}

export interface WorkerProfileStatsResponseDto {
  id: string;
  name: string;
  workerProfileImage?: string;
  totalWorksCompleted: number;
  avgRating: number;
  totalReviews: number;
  testimonials: { rating: number; testimonial?: string; createdAt: Date }[];
}