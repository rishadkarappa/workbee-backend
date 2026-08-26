import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../shared/helpers/ResponseHelper";
import { ErrorMessages } from "../../shared/constants/ErrorMessages";
import { CreateReviewDto } from "../../application/dtos/review/ReviewDTO";
import { CreateReviewUseCase } from "../../application/use-case/review/CreateReviewUseCase";
import { CheckReviewExistsUseCase } from "../../application/use-case/review/CheckReviewExistsUseCase";
import { GetWorkerProfileStatsUseCase } from "../../application/use-case/review/GetWorkerProfileStatsUseCase";

@injectable()
export class ReviewController {
    constructor(
        @inject("CreateReviewUseCase") private readonly _createReviewUseCase: CreateReviewUseCase,
        @inject("CheckReviewExistsUseCase") private readonly _checkReviewExistsUseCase: CheckReviewExistsUseCase,
        @inject("GetWorkerProfileStatsUseCase") private readonly _getWorkerProfileStatsUseCase: GetWorkerProfileStatsUseCase,
    ) { }

    async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.headers['x-user-id'] as string;
            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
                );
                return;
            }
            const { workId, workerId, rating, testimonial } = req.body;
            const dto: CreateReviewDto = { workId, workerId, userId, rating, testimonial };
            const result = await this._createReviewUseCase.execute(dto);
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, "Review submitted successfully"));
        } catch (err) {
            next(err);
        }
    }

    async checkReviewExists(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { workId } = req.params;
            if (typeof workId !== 'string') {
                res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(ErrorMessages.WORKER.WRONG_WORKER_ID, HttpStatus.BAD_REQUEST))
                return
            }
            const result = await this._checkReviewExistsUseCase.execute(workId);
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, "Checked review status"));
        } catch (err) {
            next(err);
        }
    }

    async getWorkerProfileStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { workerId } = req.params;
            if (typeof workerId !== 'string') {
                res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(ErrorMessages.WORKER.WRONG_WORKER_ID, HttpStatus.BAD_REQUEST))
                return
            }
            const result = await this._getWorkerProfileStatsUseCase.execute(workerId);
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, "Worker profile stats retrieved"));
        } catch (err) {
            next(err);
        }
    }
}