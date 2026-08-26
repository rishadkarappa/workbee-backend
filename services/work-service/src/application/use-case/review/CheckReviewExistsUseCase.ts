import { inject, injectable } from "tsyringe";
import { IReviewRepository } from "../../../domain/repositories/IReviewRepository";

@injectable()
export class CheckReviewExistsUseCase {
  constructor(@inject("ReviewRepository") private readonly _reviewRepository: IReviewRepository) {}

  async execute(workId: string): Promise<{ exists: boolean }> {
    const review = await this._reviewRepository.findByWorkId(workId);
    return { exists: !!review };
  }
}