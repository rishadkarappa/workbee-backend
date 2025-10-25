import { Request, Response } from "express";
import { ApplyWorkerUseCase } from "../../use-case/ApplyWorkerUseCase";
import { inject, injectable } from "tsyringe";
import { GetNewAppliersUseCase } from "../../use-case/GetNewAppliersUseCase";
import { HttpStatus } from "../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../shared/helpers/ResponseHelper";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";
import { WorkerLoginUseCase } from "../../use-case/WorkerLoginUseCase";
import { WorkerModel } from "../../infrastructure/database/models/WorkerSchema";

@injectable()
export class WorkController {
  constructor(
    @inject(ApplyWorkerUseCase) private applyWorkerUseCase: ApplyWorkerUseCase,
    @inject(GetNewAppliersUseCase) private getNewAppliersUseCase: GetNewAppliersUseCase,
    @inject(WorkerLoginUseCase) private workerLoginUseCase: WorkerLoginUseCase,
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

  async workerLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.workerLoginUseCase.execute(email, password)
      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(result, "wokrer lgoined successfully"))
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST))
    }
  }

  async approveWorker(req:Request, res:Response):Promise<void>{
    try {
        
    } catch (error) {
      
    }
  }
}
