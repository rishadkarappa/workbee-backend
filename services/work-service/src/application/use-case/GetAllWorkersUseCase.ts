import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerResponseDto } from "../dtos/worker/WorkerDTO";
import { WorkerMapper } from "../mappers/WorkerMapper";
import { IGetAllWorkersUseCase } from "../ports/worker/IGetAllWorkersUseCase";


@injectable()
export class GetAllWorkersUseCase implements IGetAllWorkersUseCase {
    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository
    ) {}

    async execute(page: number, limit: number, search: string): Promise<{
        workers: WorkerResponseDto[];
        total: number;
    }> {
        const result = await this.workerRepository.getAllWorkers(page, limit, search);
        
        if (!result.workers || result.workers.length === 0) {
            return { workers: [], total: 0 };
        }

        return {
            workers: WorkerMapper.toResponseDtoList(result.workers),
            total: result.total
        };
    }
}

