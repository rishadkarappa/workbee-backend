import { inject, injectable } from "tsyringe";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";

import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { WorkerResponseDto } from "../../dtos/worker/WorkerDTO";
import { WorkerMapper } from "../../mappers/WorkerMapper";

import { IGetNewAppliersUseCase } from "../../ports/worker/IGetNewAppliersUseCase";

@injectable()
export class GetNewAppliersUseCase implements IGetNewAppliersUseCase {
    constructor(
        @inject("WorkerRepository") private _workerRepository: IWorkerRepository
    ) { }

    async execute(page: number, limit: number, search: string): Promise<{
        workers: WorkerResponseDto[];
        total: number;
    }> {
        const result = await this._workerRepository.getNewAppliers(page, limit, search);

        if (!result.workers || result.workers.length === 0) {
            return { workers: [], total: 0 };
        }

        return {
            workers: WorkerMapper.toResponseDtoList(result.workers),
            total: result.total
        };
    }
}