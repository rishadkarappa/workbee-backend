import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";

import { WorkerLoginRequestDTO } from "../../../application/dtos/worker/LoginWorkerDTO";
import { IWorkerLoginUseCase } from "../../../application/ports/worker/IWorkerLoginUseCase";

import { IWorkerController } from "../../ports/IWorkerController";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";

@injectable()
export class WorkerController implements IWorkerController{
    constructor(
        @inject("WorkerLoginUseCase") private readonly _workerLoginUseCase: IWorkerLoginUseCase,

    ){}

    async workerLogin(req: Request, res: Response, next:NextFunction):Promise<void> {
        try {
            const dto: WorkerLoginRequestDTO = req.body;

            const worker = await this._workerLoginUseCase.execute(dto);

            res.status(HttpStatus.OK)
                .json(ResponseHelper.success(worker, ResponseMessage.AUTH.WORKER_LOGGED));
        } catch (err: any) {
            next(err)
        }
    }

}