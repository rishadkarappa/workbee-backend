import { inject, injectable } from "tsyringe";
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
            return []
        }
        return WorkerMapper.toResponseDtoList(newAppliers);
    }
}