import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { HttpStatus } from "../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../shared/helpers/ResponseHelper";
import { ErrorMessages } from "../../shared/constants/ErrorMessages";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";

import { CreateReviewDto } from "../../application/dtos/review/ReviewDTO";

import { ICreateReviewUseCase } from "../../application/ports/review/ICreateReviewUseCase";
import { ICheckReviewExistsUseCase } from "../../application/ports/review/ICheckReviewExistsUseCase";
import { IGetWorkerProfileStatsUseCase } from "../../application/ports/review/IGetWorkerProfileStatsUseCase";

@injectable()
export class ReviewController {
    constructor(
        @inject("CreateReviewUseCase") private readonly _createReviewUseCase: ICreateReviewUseCase,
        @inject("CheckReviewExistsUseCase") private readonly _checkReviewExistsUseCase: ICheckReviewExistsUseCase,
        @inject("GetWorkerProfileStatsUseCase") private readonly _getWorkerProfileStatsUseCase: IGetWorkerProfileStatsUseCase,
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
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.REVIEW.CREATED_REVIEW));
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
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.REVIEW.CHECKED_REVIEW_STATUS));
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
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.WORKER.PROFILE_STAT_RETRIEVED));
        } catch (err) {
            next(err);
        }
    }
}