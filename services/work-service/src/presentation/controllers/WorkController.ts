import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../shared/helpers/ResponseHelper";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";

import { DeleteWorkDto, PostWorkDto, UpdateWorkDto } from "../../application/dtos/work/WorkDTO";
import { ApplyWorkerDto, WorkerApproveDto } from "../../application/dtos/worker/WorkerDTO";

import { IApplyWorkerUseCase } from "../../application/ports/worker/IApplyWorkerUseCase";
import { IGetNewAppliersUseCase } from "../../application/ports/worker/IGetNewAppliersUseCase";
import { IWorkerApproveUseCase } from "../../application/ports/worker/IWorkerApproveUseCase";
import { IGetAllWorkersUseCase } from "../../application/ports/worker/IGetAllWorkersUseCase";
import { IPostWorkUseCase } from "../../application/ports/work/IPostWorkUseCase";
import { IFileUploadService } from "../../domain/services/IFileUploadService";
import { IGetAllWorksUseCase } from "../../application/ports/work/IGetAllWorksUseCase";

import { IWorkController } from "../ports/IWorkContoller";
import { IBlockWorkerUseCase } from "../../application/ports/worker/IBlockWorkerUseCase";
import { IGetMyWorksUseCase } from "../../application/ports/user/IGetMyWorksUseCase";
import { IUpdateWorkUseCase } from "../../application/ports/user/IUpdateWorkUseCase";
import { IDeleteMyWorkUseCase } from "../../application/ports/user/IDeleteMyWorkUseCase";
import { IGetWorkerProfileUseCase } from "../../application/ports/worker/IGetWorkerProfileUseCase";
import { IGetWorkerProfileBatchUseCase } from "../../application/ports/isc/IGetWorkerProfilesBatchUseCase";
import { IGetWorkerAssignedWorksUseCase } from "../../application/ports/isc/IGetWorkerAssignedWorksUseCase";
import { ErrorMessages } from "../../shared/constants/ErrorMessages";

@injectable()
export class WorkController implements IWorkController {
    constructor(
        @inject("ApplyWorkerUseCase") private readonly _applyWorkerUseCase: IApplyWorkerUseCase,
        @inject("GetNewAppliersUseCase") private readonly _getNewAppliersUseCase: IGetNewAppliersUseCase,
        @inject("WorkerApproveUseCase") private readonly _workerApproveUseCase: IWorkerApproveUseCase,
        @inject("GetAllWorkersUseCase") private readonly _getAllWorkersUseCase: IGetAllWorkersUseCase,
        @inject("PostWorkUseCase") private readonly _postWorkUseCase: IPostWorkUseCase,
        @inject("FileUploadService") private readonly _fileUploadService: IFileUploadService,
        @inject("GetAllWorksUseCase") private readonly _getAllWorksUseCase: IGetAllWorksUseCase,
        @inject("BlockWorkerUseCase") private readonly _blockWorkerUseCase: IBlockWorkerUseCase,
        @inject("GetMyWorksUseCase") private readonly _getMyWorksUseCase: IGetMyWorksUseCase,
        @inject("UpdateWorkUseCase") private readonly _updateWorkUseCase: IUpdateWorkUseCase,
        @inject("DeleteMyWorkUseCase") private readonly _deleteMyWorkUseCase: IDeleteMyWorkUseCase,
        @inject("GetWorkerProfileUseCase") private readonly _getWorkerProfileUseCase: IGetWorkerProfileUseCase,
        @inject("GetWorkerProfilesBatchUseCase") private readonly _getWorkerProfilesBatchUseCase: IGetWorkerProfileBatchUseCase,
        @inject("GetWorkerAssignedWorksUseCase") private readonly _getWorkerAssignedWorksUseCase: IGetWorkerAssignedWorksUseCase,
    ) { }

    async applyWorker(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: ApplyWorkerDto = req.body;
            const result = await this._applyWorkerUseCase.execute(dto);

            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(result, ResponseMessage.WORKER.APPLIED));
        } catch (err) {
            next(err);
        }
    }


    async getNewAppliers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const result = await this._getNewAppliersUseCase.execute(page, limit, search);

            res.status(HttpStatus.OK).json(
                ResponseHelper.success(
                    {
                        workers: result.workers,
                        total: result.total,
                        page,
                        limit,
                        totalPages: Math.ceil(result.total / limit)
                    },
                    ResponseMessage.WORKER.GET_ALL_APPLIERS
                )
            );
        } catch (err) {
            next(err);
        }
    }

    async approveWorker(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: WorkerApproveDto = {
                workerId: req.body.workerId,
                status: req.body.status,
                rejectionReason: req.body.rejectionReason
            };

            const result = await this._workerApproveUseCase.execute(dto);
            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(result, ResponseMessage.WORK.WORK_STATUS_UPDATED));
        } catch (err) {
            next(err);
        }
    }

    async getWorkers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";
            const status = (req.query.status as string) || "all";

            const result = await this._getAllWorkersUseCase.execute(page, limit, search, status);

            res.status(HttpStatus.OK).json(
                ResponseHelper.success(
                    {
                        workers: result.workers,
                        total: result.total,
                        page,
                        limit,
                        totalPages: Math.ceil(result.total / limit)
                    },
                    "Get all workers"
                )
            );
        } catch (err) {
            next(err);
        }
    }

    async postWork(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const rawData = req.body;
            const files = req.files as any;

            // Handle file uploads
            if (files) {
                console.log("Processing files...");
                if (files.voiceFile) {
                    rawData.voiceFile = await this._fileUploadService.saveFile(
                        files.voiceFile[0],
                        'voice'
                    );
                    console.log("Voice file saved:", rawData.voiceFile);
                }
                if (files.videoFile) {
                    rawData.videoFile = await this._fileUploadService.saveFile(
                        files.videoFile[0],
                        'video'
                    );
                    console.log("Video file saved:", rawData.videoFile);
                }
                if (files.beforeImage) {
                    rawData.beforeImage = await this._fileUploadService.saveFile(
                        files.beforeImage[0],
                        'images'
                    );
                    console.log("Image file saved:", rawData.beforeImage);
                }
            }

            const termsAccepted = rawData.termsAccepted === 'true' || rawData.termsAccepted === true;

            const dto: PostWorkDto = {
                ...rawData,
                termsAccepted
            };

            const result = await this._postWorkUseCase.execute(dto);

            res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.WORK.WORK_BOOKED));
        } catch (err) {
            next(err);
        }
    }

    async getAllWorks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                search = '',
                status = 'all',
                page = '1',
                limit = '10',
                latitude,
                longitude,
                maxDistance
            } = req.query;

            const filters: any = {
                search: search as string,
                status: status as string,
                page: parseInt(page as string),
                limit: parseInt(limit as string)
            };

            if (latitude && longitude && maxDistance) {
                filters.latitude = parseFloat(latitude as string);
                filters.longitude = parseFloat(longitude as string);
                filters.maxDistance = parseFloat(maxDistance as string);
            }

            const result = await this._getAllWorksUseCase.execute(filters);

            res.status(HttpStatus.OK).json(
                ResponseHelper.success(
                    {
                        works: result.works,
                        pagination: {
                            total: result.total,
                            totalPages: result.totalPages,
                            currentPage: parseInt(page as string),
                            limit: parseInt(limit as string)
                        }
                    },
                    "Successfully retrieved works"
                )
            );
        } catch (err) {
            next(err);
        }
    }

    async blockWorker(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workerId = req.params.id;
            const result = await this._blockWorkerUseCase.execute(workerId);
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.AUTH.BLOCKED_WORKER));
        } catch (err) {
            next(err);
        }
    }

    async getMyWorks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.headers['x-user-id'] as string;

            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
                );
                return;
            }

            const result = await this._getMyWorksUseCase.execute(userId);
            res.status(HttpStatus.OK).json(
                ResponseHelper.success(result, ResponseMessage.WORK.RETRIEVED_WORKS)
            );
        } catch (err) {
            next(err);
        }
    }

    async updateWork(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workId = req.params.workId;
            const userId = req.headers['x-user-id'] as string;
            const updateData = req.body;

            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
                );
                return;
            }

            const dto: UpdateWorkDto = {
                workId,
                userId,
                ...updateData
            };

            const updatedWork = await this._updateWorkUseCase.execute(dto);

            res.status(HttpStatus.OK).json(
                ResponseHelper.success(updatedWork, ResponseMessage.WORK.WORK_UPDATED)
            );
        } catch (err) {
            next(err);
        }
    }

    async deleteMyWork(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.headers["x-user-id"] as string;

            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
                );
                return;
            }

            const dto: DeleteWorkDto = {
                workId: req.params.workId,
                userId
            };

            const result = await this._deleteMyWorkUseCase.execute(dto);

            res.status(HttpStatus.OK).json(
                ResponseHelper.success(result, ResponseMessage.WORK.WORK_DELETED)
            );

        } catch (err) {
            next(err);
        }
    }


    /** ==========================================================
     * inter ser comm with chat
     * ===========================================================
     */

    async getWorkerProfile(req: Request, res: Response, next:NextFunction):Promise<void> {
        try {
            const { workerId } = req.params;
            const profile = await this._getWorkerProfileUseCase.execute({ workerId });
            res.status(HttpStatus.OK).json(ResponseHelper.success(profile, ResponseMessage.WORKER.WORKER_PROFILE_RETRIEVED));
        } catch (error) {
            next(error)
        }
    }

    async getWorkerProfilesBatch(req: Request, res: Response, next:NextFunction):Promise<void> {
        try {
            const { workerIds } = req.body;

            if (!Array.isArray(workerIds)) {
                res.status(HttpStatus.BAD_REQUEST).json(
                    ResponseHelper.error(ErrorMessages.WORKER.WORKER_ID_MUST_BE_ARRAY, HttpStatus.BAD_REQUEST)
                );
                return;
            }

            const profiles = await this._getWorkerProfilesBatchUseCase.execute({ workerIds });
            res.status(HttpStatus.OK).json(ResponseHelper.success(profiles, ResponseMessage.WORKER.WORKER_PROFILE_RETRIEVED_BATCH));
        } catch (error) {
            next(error)
        }
    }

    async getWorkerAssignedWorks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workerId = req.headers['x-user-id'] as string;

            if (!workerId) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
                );
                return;
            }

            const result = await this._getWorkerAssignedWorksUseCase.execute({workerId});
            res.status(HttpStatus.OK).json(
                ResponseHelper.success(result, ResponseMessage.WORKER.WORKER_ASSIGNED_WORK_RETRIEVED)
            );
        } catch (err) {
            next(err);
        }
    }

}