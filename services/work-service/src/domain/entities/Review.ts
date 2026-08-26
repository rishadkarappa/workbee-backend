export interface Review {
  id: string;
  workId: string;
  workerId: string;
  userId: string;
  rating: number;
  testimonial?: string;
  createdAt: Date;
}