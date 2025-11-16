import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";

import { WorkerLoginUseCase } from "../../../application/use-cases/worker/WorkerLoginUseCase";
import { WorkerLoginRequestDTO } from "../../../application/dtos/worker/LoginWorkerDTO";

@injectable()
export class WorkerController {
    constructor(
        @inject(WorkerLoginUseCase) private workerLoginUseCase: WorkerLoginUseCase

    ) { }

    async workerLogin(req: Request, res: Response) {
        try {
            const dto: WorkerLoginRequestDTO = req.body;

            const worker = await this.workerLoginUseCase.execute(dto);

            res.status(HttpStatus.OK)
                .json(ResponseHelper.success(worker, "Worker logged in successfully"));
        } catch (err: any) {
            res.status(HttpStatus.BAD_REQUEST)
                .json(ResponseHelper.error(err.message, HttpStatus.BAD_REQUEST));
        }
    }

}