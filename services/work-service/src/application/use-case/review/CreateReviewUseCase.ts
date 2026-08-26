import { inject, injectable } from "tsyringe";
import { IReviewRepository } from "../../../domain/repositories/IReviewRepository";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { CreateReviewDto, ReviewResponseDto } from "../../dtos/review/ReviewDTO";
import { ReviewMapper } from "../../mappers/ReviewMapper";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class CreateReviewUseCase {
  constructor(
    @inject("ReviewRepository") private readonly _reviewRepository: IReviewRepository,
    @inject("WorkRepository") private readonly _workRepository: IWorkRepository
  ) {}

  async execute(dto: CreateReviewDto): Promise<ReviewResponseDto> {
    if (!dto.rating || dto.rating < 1 || dto.rating > 5) {
      throw new Error(ErrorMessages.REVIEW.INVALID_RATING);
    }
    if (dto.testimonial && dto.testimonial.length > 500) {
      throw new Error(ErrorMessages.REVIEW.TESTIMONIAL_TOO_LONG);
    }

    const work = await this._workRepository.findById(dto.workId);
    if (!work) throw new Error(ErrorMessages.WORK.WORK_NOT_FOUND);

    if (String(work.userId) !== String(dto.userId)) {
      throw new Error(ErrorMessages.WORK.DONT_HAVE_PERMISSION_TO_UPDATE);
    }
    if (work.status !== "completed") {
      throw new Error(ErrorMessages.REVIEW.WORK_NOT_COMPLETED);
    }

    const existing = await this._reviewRepository.findByWorkId(dto.workId);
    if (existing) {
      throw new Error(ErrorMessages.REVIEW.ALREADY_REVIEWED);
    }

    const created = await this._reviewRepository.create({
      workId: dto.workId,
      workerId: dto.workerId,
      userId: dto.userId,
      rating: dto.rating,
      testimonial: dto.testimonial?.trim() || undefined,
    });

    return ReviewMapper.toResponseDto(created);
  }
}