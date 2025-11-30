import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerApproveDto, WorkerResponseDto } from "../dtos/WorkerDTO";
import { WorkerMapper } from "../mappers/WorkerMapper";
import { IWorkerApproveUseCase } from "../ports/worker/IWorkerApproveUseCase";
import { WorkerStatus } from "../../infrastructure/database/models/WorkerSchema";

@injectable()
export class WorkerApproveUseCase implements IWorkerApproveUseCase {
    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository
    ) {}

    async execute(dto: WorkerApproveDto): Promise<WorkerResponseDto> {
        console.log("WorkerApproveUseCase - Received DTO:", dto);

        if (!dto.workerId) {
            throw new Error("Worker ID is required");
        }

        if (!dto.status || !["approved", "rejected"].includes(dto.status)) {
            throw new Error("Valid status (approved or rejected) is required");
        }

        const worker = await this.workerRepository.findById(dto.workerId);
        // console.log("found worker:", worker);

        if (!worker) {
            throw new Error("Worker not found with ID: " + dto.workerId);
        }

        // Update status
        worker.status = dto.status === "approved"
            ? WorkerStatus.APPROVED
            : WorkerStatus.REJECTED;

        console.log("WorkerApproveUseCase - Updating worker status to:", worker.status);

        const updatedWorker = await this.workerRepository.save(worker);
        // console.log("updated worker", updatedWorker);

        return WorkerMapper.toResponseDto(updatedWorker);
    }
}