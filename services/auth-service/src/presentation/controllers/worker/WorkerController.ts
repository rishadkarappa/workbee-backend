import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "../../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../../shared/helpers/responseHelper";

import { WorkerLoginUseCase } from "../../../application/use-cases/worker/WorkerLoginUseCase";

@injectable()
export class WorkerController {
    constructor(
        @inject(WorkerLoginUseCase) private workerLoginUseCase: WorkerLoginUseCase

    ) { }

    // async workerLogin(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { email, password } = req.body;
    //         const result = await this.workerLoginUseCase.execute(email, password);

    //         res
    //             .status(HttpStatus.OK)
    //             .json(ResponseHelper.success(result, "Worker logged in successfully"));
    //     } catch (error: any) {
    //         res
    //             .status(HttpStatus.BAD_REQUEST)
    //             .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    //     }
    // }
    async workerLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ResponseHelper.error("Email and password are required", HttpStatus.BAD_REQUEST));
                return;
            }

            const worker = await this.workerLoginUseCase.execute(email, password);

            res
                .status(HttpStatus.OK)
                .json(ResponseHelper.success(worker, "Worker logged in successfully"));
        } catch (error: any) {
            res
                .status(HttpStatus.BAD_REQUEST)
                .json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
        }
    }
}