import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";

import { WorkerLoginRequestDTO } from "../../../application/dtos/worker/LoginWorkerDTO";
import { IWorkerLoginUseCase } from "../../../application/ports/worker/IWorkerLoginUseCase";

import { IWorkerController } from "../../ports/IWorkerController";

@injectable()
export class WorkerController implements IWorkerController{
    constructor(
        @inject("WorkerLoginUseCase") private _workerLoginUseCase: IWorkerLoginUseCase,

    ){}

    async workerLogin(req: Request, res: Response, next:NextFunction):Promise<void> {
        try {
            const dto: WorkerLoginRequestDTO = req.body;

            const worker = await this._workerLoginUseCase.execute(dto);

            res.status(HttpStatus.OK)
                .json(ResponseHelper.success(worker, "Worker logged in successfully"));
        } catch (err) {
            next(err)
        }
    }

}