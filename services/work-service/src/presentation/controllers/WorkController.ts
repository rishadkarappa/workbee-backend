import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../shared/helpers/ResponseHelper";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";

import { ApplyWorkerUseCase } from "../../application/use-case/ApplyWorkerUseCase";
import { GetNewAppliersUseCase } from "../../application/use-case/GetNewAppliersUseCase";
import { WorkerApproveUseCase } from "../../application/use-case/WorkerApproveUseCase";
import { GetAllWorkersUseCase } from "../../application/use-case/GetAllWorkersUseCase";
import { PostWorkUseCase } from "../../application/use-case/PostWorkUseCase";
import { FileUploadService } from "../../infrastructure/services/FileUploadService";
import { GetAllWorksUseCase } from "../../application/use-case/GetAllWorksUseCase";
import { PostWorkDto } from "../../application/dtos/WorkDTO";
import { ApplyWorkerDto, WorkerApproveDto } from "../../application/dtos/WorkerDTO";

@injectable()
export class WorkController {
    constructor(
        @inject(ApplyWorkerUseCase) private applyWorkerUseCase: ApplyWorkerUseCase,
        @inject(GetNewAppliersUseCase) private getNewAppliersUseCase: GetNewAppliersUseCase,
        @inject(WorkerApproveUseCase) private workerApproveUseCase: WorkerApproveUseCase,
        @inject(GetAllWorkersUseCase) private getAllWorkersUseCase: GetAllWorkersUseCase,
        @inject(PostWorkUseCase) private postWorkUseCase: PostWorkUseCase,
        @inject("FileUploadService") private fileUploadService: FileUploadService,
        @inject(GetAllWorksUseCase) private getAllWorksUseCase: GetAllWorksUseCase
    ) {}

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
            const appliers = await this.getNewAppliersUseCase.execute();
            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(appliers, ResponseMessage.WORKER.GET_ALL_APPLIERS));
        } catch (error: any) {
            res
                .status(HttpStatus.BAD_REQUEST)
                .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
        }
    }

    async approveWorker(req: Request, res: Response): Promise<void> {
        try {
            const dto: WorkerApproveDto = { email: req.body.email };
            const result = await this.workerApproveUseCase.execute(dto);
            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(result, "Worker approved successfully"));
        } catch (error: any) {
            res
                .status(HttpStatus.BAD_REQUEST)
                .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
        }
    }

    async getWorkers(req: Request, res: Response): Promise<void> {
        try {
            const workers = await this.getAllWorkersUseCase.execute();
            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(workers, "Get all workers"));
        } catch (error: any) {
            res
                .status(HttpStatus.BAD_REQUEST)
                .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
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

            console.log("Final WorkData:", JSON.stringify(dto, null, 2));
            console.log("Calling PostWorkUseCase...");

            const result = await this.postWorkUseCase.execute(dto);

            console.log("Work posted successfully:", result);

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
            const works = await this.getAllWorksUseCase.execute();
            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(works, "Get all works"));
        } catch (error: any) {
            res
                .status(HttpStatus.BAD_REQUEST)
                .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
        }
    }
}