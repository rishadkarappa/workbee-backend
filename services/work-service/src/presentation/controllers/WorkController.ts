import { Request, Response } from "express";
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
import { GetWorkersCountUseCase } from "../../application/use-case/GetWorkersCountUseCase";
import { IBlockWorkerUseCase } from "../../application/ports/worker/IBlockWorkerUseCase";
import { IGetMyWorksUseCase } from "../../application/ports/user/IGetMyWorksUseCase";
import { IUpdateWorkUseCase } from "../../application/ports/user/IUpdateWorkUseCase";
import { IDeleteMyWorkUseCase } from "../../application/ports/user/IDeleteMyWorkUseCase";

@injectable()
export class WorkController implements IWorkController {
    constructor(
        @inject("ApplyWorkerUseCase") private applyWorkerUseCase: IApplyWorkerUseCase,
        @inject("GetNewAppliersUseCase") private getNewAppliersUseCase: IGetNewAppliersUseCase,
        @inject("WorkerApproveUseCase") private workerApproveUseCase: IWorkerApproveUseCase,
        @inject("GetAllWorkersUseCase") private getAllWorkersUseCase: IGetAllWorkersUseCase,
        @inject("PostWorkUseCase") private postWorkUseCase: IPostWorkUseCase,
        @inject("FileUploadService") private fileUploadService: IFileUploadService,
        @inject("GetAllWorksUseCase") private getAllWorksUseCase: IGetAllWorksUseCase,
        @inject("GetWorkersCountUseCase") private getWorkersCountUseCase: GetWorkersCountUseCase,
        @inject("BlockWorkerUseCase") private blockWorkerUseCase: IBlockWorkerUseCase,
        @inject("GetMyWorksUseCase") private getMyWorksUseCase: IGetMyWorksUseCase,
        @inject("UpdateWorkUseCase") private updateWorkUseCase: IUpdateWorkUseCase,
        @inject("DeleteMyWorkUseCase") private deleteMyWorkUseCase: IDeleteMyWorkUseCase,
    ) { }

    async applyWorker(req: Request, res: Response): Promise<void> {
        try {
            const dto: ApplyWorkerDto = req.body;
            const result = await this.applyWorkerUseCase.execute(dto);

            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(result, ResponseMessage.WORKER.APPLIED));
        } catch (error: any) {
            res
                .status(HttpStatus.BAD_REQUEST)
                .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
        }
    }


    async getNewAppliers(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const result = await this.getNewAppliersUseCase.execute(page, limit, search);

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
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(
                ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST)
            );
        }
    }

    async approveWorker(req: Request, res: Response): Promise<void> {
    try {
        const dto: WorkerApproveDto = {
            workerId: req.body.workerId,
            status: req.body.status,
            rejectionReason: req.body.rejectionReason 
        };

        const result = await this.workerApproveUseCase.execute(dto);
        res
            .status(HttpStatus.OK)
            .json(ResponseHelper.success(result, "Worker status updated successfully"));
    } catch (error: any) {
        res
            .status(HttpStatus.BAD_REQUEST)
            .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
}


    async getWorkers(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const result = await this.getAllWorkersUseCase.execute(page, limit, search);

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
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(
                ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST)
            );
        }
    }

    async postWork(req: Request, res: Response): Promise<void> {
        try {
            const rawData = req.body;
            const files = req.files as any;

            // Handle file uploads
            if (files) {
                console.log("Processing files...");
                if (files.voiceFile) {
                    rawData.voiceFile = await this.fileUploadService.saveFile(
                        files.voiceFile[0],
                        'voice'
                    );
                    console.log("Voice file saved:", rawData.voiceFile);
                }
                if (files.videoFile) {
                    rawData.videoFile = await this.fileUploadService.saveFile(
                        files.videoFile[0],
                        'video'
                    );
                    console.log("Video file saved:", rawData.videoFile);
                }
                if (files.beforeImage) {
                    rawData.beforeImage = await this.fileUploadService.saveFile(
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

            console.log("einal WorkData", JSON.stringify(dto, null, 2));
            console.log("calling PostWorkUseCase;;;;");

            const result = await this.postWorkUseCase.execute(dto);

            console.log("work posted successfully=", result);

            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(result, "Task booked successfully"));
        } catch (error: any) {
            res
                .status(HttpStatus.BAD_REQUEST)
                .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
        }
    }

    async getAllWorks(req: Request, res: Response): Promise<void> {
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

            const result = await this.getAllWorksUseCase.execute(filters);

            res.status(200).json({
                success: true,
                data: result.works,
                pagination: {
                    total: result.total,
                    totalPages: result.totalPages,
                    currentPage: parseInt(page as string),
                    limit: parseInt(limit as string)
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get works"
            });
        }
    }


    async getWorkersCount(req: Request, res: Response): Promise<void> {
        try {
            const count = await this.getWorkersCountUseCase.execute()
            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(count, "Get workes count"));
        } catch (error: any) {
            res
                .status(HttpStatus.BAD_REQUEST)
                .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
        }
    }

    async blockWorker(req: Request, res: Response) {
        try {
            const workerId = req.params.id
            const result = await this.blockWorkerUseCase.execute(workerId)
            res.status(HttpStatus.OK).json(ResponseHelper.success(result, "blocked worker"))
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.NOT_FOUND))
        }
    }

    async getMyWorks(req: Request, res: Response) {
        try {
            const userId = req.headers['x-user-id'] as string;

            if (!userId) {
                return res.status(HttpStatus.UNAUTHORIZED).json(
                    ResponseHelper.error("Unauthorized", HttpStatus.UNAUTHORIZED)
                );
            }

            const result = await this.getMyWorksUseCase.execute(userId);
            res.status(HttpStatus.OK).json(
                ResponseHelper.success(result, "Successfully retrieved user works")
            );
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(
                ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST)
            );
        }
    }

    async updateWork(req: Request, res: Response) {
        try {
            const workId = req.params.workId;
            const userId = req.headers['x-user-id'] as string;
            const updateData = req.body;

            if (!userId) {
                return res.status(HttpStatus.UNAUTHORIZED).json(
                    ResponseHelper.error("Unauthorized", HttpStatus.UNAUTHORIZED)
                );
            }

            const dto: UpdateWorkDto = {
                workId,
                userId,
                ...updateData
            };

            const updatedWork = await this.updateWorkUseCase.execute(dto);

            res.status(HttpStatus.OK).json(
                ResponseHelper.success(updatedWork, "Work updated successfully")
            );
        } catch (error: any) {
            // console.error('update work error', error);
            res.status(HttpStatus.BAD_REQUEST).json(
                ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST)
            );
        }
    }

    async deleteMyWork(req: Request, res: Response) {
        try {
            const userId = req.headers["x-user-id"] as string;

            if (!userId) {
                return res.status(401).json(
                    ResponseHelper.error("Unauthorized", 401)
                );
            }

            const dto: DeleteWorkDto = {
                workId: req.params.workId,
                userId
            };

            const result = await this.deleteMyWorkUseCase.execute(dto);

            res.status(200).json(
                ResponseHelper.success(result, "Work deleted successfully")
            );

        } catch (error: any) {
            res.status(400).json(
                ResponseHelper.error(error.message, 400)
            );
        }
    }

}