import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerApproveDto, WorkerResponseDto } from "../dtos/WorkerDTO";
import { WorkerMapper } from "../mappers/WorkerMapper";
import { IWorkerApproveUseCase } from "../ports/worker/IWorkerApproveUseCase";

@injectable()
export class WorkerApproveUseCase implements IWorkerApproveUseCase{
    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository
    ) {}

    async execute(dto: WorkerApproveDto): Promise<WorkerResponseDto> {
        const worker = await this.workerRepository.findByEmail(dto.email);
        if (!worker) throw new Error("Worker not found");
        
        worker.isApproved = true;
        const updatedWorker = await this.workerRepository.save(worker);
        return WorkerMapper.toResponseDto(updatedWorker);
    }
}