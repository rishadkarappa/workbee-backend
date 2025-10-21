import { Request, Response } from "express";
import { ApplyWorkerUseCase } from "../../use-case/ApplyWorkerUseCase";
import { inject, injectable } from "tsyringe";
import { GetNewAppliersUseCase } from "../../use-case/GetNewAppliersUseCase";
import { HttpStatus } from "../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../shared/helpers/ResponseHelper";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";

@injectable()
export class WorkController {
  constructor(
    @inject(ApplyWorkerUseCase) private applyWorkerUseCase: ApplyWorkerUseCase,
    @inject(GetNewAppliersUseCase) private getNewAppliersUseCase: GetNewAppliersUseCase,
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
}
