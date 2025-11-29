import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerResponseDto } from "../dtos/WorkerDTO";
import { WorkerMapper } from "../mappers/WorkerMapper";
import { IGetAllWorkersUseCase } from "../ports/worker/IGetAllWorkersUseCase";

@injectable()
export class GetAllWorkersUseCase implements IGetAllWorkersUseCase {
    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository
    ) {}

    async execute(): Promise<WorkerResponseDto[]> {
        const workers = await this.workerRepository.getAllWorkers();
        if (!workers || workers.length === 0) {
            throw new Error("No approved workers found");
        }
        return WorkerMapper.toResponseDtoList(workers);
    }
}