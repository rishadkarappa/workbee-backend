import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../shared/helpers/ResponseHelper";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";

import { ApplyWorkerUseCase } from "../../use-case/ApplyWorkerUseCase";
import { GetNewAppliersUseCase } from "../../use-case/GetNewAppliersUseCase";
import { WorkerApproveUseCase } from "../../use-case/WorkerApproveUseCase";
import { GetAllWorkersUseCase } from "../../use-case/GetAllWorkersUseCase";
import { PostWorkUseCase } from "../../use-case/PostWorkUseCase";
import { FileUploadService } from "../../infrastructure/services/FileUploadService";
import { GetAllWorksUseCase } from "../../use-case/GetAllWorksUseCase";

@injectable()
export class WorkController {
  constructor(
    @inject(ApplyWorkerUseCase) private applyWorkerUseCase: ApplyWorkerUseCase,
    @inject(GetNewAppliersUseCase) private getNewAppliersUseCase: GetNewAppliersUseCase,
    @inject(WorkerApproveUseCase) private workerApproveUseCase: WorkerApproveUseCase,
    @inject(GetAllWorkersUseCase) private getAllWorkersUseCase: GetAllWorkersUseCase,
    @inject(PostWorkUseCase) private postWorkUseCase: PostWorkUseCase,
    @inject("FileUploadService") private fileUploadService: FileUploadService,
    @inject(GetAllWorksUseCase) private getAllWorksUseCase:GetAllWorksUseCase

  ) { }

  async applyWorker(req: Request, res: Response): Promise<void> {
    try {
      const workerData = req.body;
      const result = await this.applyWorkerUseCase.execute(workerData);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(result, ResponseMessage.WORKER.APPLIED))
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST))
    }
  }

  async getNewAppliers(req: Request, res: Response): Promise<void> {
    try {
      const appliers = await this.getNewAppliersUseCase.execute()
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(appliers, ResponseMessage.WORKER.GET_ALL_APPLIERS))
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST))
    }
  }

  async approveWorker(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body
      const result = await this.workerApproveUseCase.execute(email)
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(result, "wokrer approved successfully"))
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST))
    }
  }

  async getWorkers(req: Request, res: Response): Promise<void> {
    try {
      const workers = await this.getAllWorkersUseCase.execute()
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(workers, "get all wokrers"))
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST))
    }
  }

  async postWork(req: Request, res: Response): Promise<void> {
    try {
      const WorkData = req.body;
      const files = req.files as any;

      if (files) {
        console.log("Processing files...");
        if (files.voiceFile) {
          WorkData.voiceFile = await this.fileUploadService.saveFile(files.voiceFile[0], 'voice');
          console.log("Voice file saved:", WorkData.voiceFile);
        }
        if (files.videoFile) {
          WorkData.videoFile = await this.fileUploadService.saveFile(files.videoFile[0], 'video');
          console.log("Video file saved:", WorkData.videoFile);
        }
        if (files.beforeImage) {
          WorkData.beforeImage = await this.fileUploadService.saveFile(files.beforeImage[0], 'images');
          console.log("Image file saved:", WorkData.beforeImage);
        }
      }

      WorkData.termsAccepted = WorkData.termsAccepted === 'true' || WorkData.termsAccepted === true;

      console.log("Final WorkData:", JSON.stringify(WorkData, null, 2));
      console.log("Calling PostWorkUseCase...");

      const result = await this.postWorkUseCase.execute(WorkData);

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

  async getAllWorks(req:Request, res:Response):Promise<void>{
    try{
      const works = await this.getAllWorksUseCase.execute()
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(works, "get all works"))
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST))
    }
  }

}
