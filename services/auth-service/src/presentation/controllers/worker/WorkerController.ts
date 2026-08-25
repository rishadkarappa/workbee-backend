import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";

import { WorkerLoginRequestDTO } from "../../../application/dtos/worker/LoginWorkerDTO";
import { IWorkerLoginUseCase } from "../../../application/ports/worker/IWorkerLoginUseCase";

import { IWorkerController } from "../../ports/IWorkerController";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";
import { IChangeWorkerPasswordUseCase } from "../../../application/ports/worker/IChangeWorkerPasswordUseCase";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class WorkerController implements IWorkerController {
    constructor(
        @inject("WorkerLoginUseCase") private readonly _workerLoginUseCase: IWorkerLoginUseCase,
        @inject("ChangeWorkerPasswordUseCase") private readonly _changeWorkerPasswordUseCase: IChangeWorkerPasswordUseCase,

    ) { }

    async workerLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: WorkerLoginRequestDTO = req.body;

            const worker = await this._workerLoginUseCase.execute(dto);

            res.status(HttpStatus.OK)
                .json(ResponseHelper.success(worker, ResponseMessage.AUTH.WORKER_LOGGED));
        } catch (err) {
            next(err)
        }
    }


    async changeWorkerPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workerId = req.headers["x-user-id"];
            
            if (!workerId || typeof workerId !== "string") {
                throw new Error(ErrorMessages.AUTH.UNAUTHORIZED);
            }

            const { currentPassword, newPassword } = req.body;
            await this._changeWorkerPasswordUseCase.execute(workerId, { currentPassword, newPassword });

            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(null, "Password changed successfully"));

        } catch (err) {
            next(err);
        }
    }

}