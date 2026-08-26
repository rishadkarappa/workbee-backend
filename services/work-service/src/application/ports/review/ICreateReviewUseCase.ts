import {
  CreateReviewDto,
  ReviewResponseDto,
} from "../../dtos/review/ReviewDTO";

export interface ICreateReviewUseCase {
  execute(dto: CreateReviewDto): Promise<ReviewResponseDto>;
}