import { inject, injectable } from "tsyringe";
import { Worker } from "../../domain/entities/Worker";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";

import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerResponseDto } from "../dtos/WorkerDTO";
import { WorkerMapper } from "../mappers/WorkerMapper";

import { IGetNewAppliersUseCase } from "../ports/worker/IGetNewAppliersUseCase";

@injectable()
export class GetNewAppliersUseCase implements IGetNewAppliersUseCase {
    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository
    ) {}

    async execute(): Promise<WorkerResponseDto[]> {
        const newAppliers = await this.workerRepository.getNewAppliers();
        if (!newAppliers) {
            throw new Error(ResponseMessage.WORKER.DONT_GET_APPLIERS);
        }
        return WorkerMapper.toResponseDtoList(newAppliers);
    }
}