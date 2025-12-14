import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { IEmailService } from "../../domain/services/IEmailService";
import { WorkerApproveDto, WorkerResponseDto } from "../dtos/worker/WorkerDTO";
import { WorkerMapper } from "../mappers/WorkerMapper";
import { IWorkerApproveUseCase } from "../ports/worker/IWorkerApproveUseCase";
import { WorkerStatus } from "../../infrastructure/database/models/WorkerSchema";

@injectable()
export class WorkerApproveUseCase implements IWorkerApproveUseCase {
    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository,
        @inject("EmailService") private emailService: IEmailService
    ) {}

    async execute(dto: WorkerApproveDto): Promise<WorkerResponseDto> {
        if (!dto.workerId) {
            throw new Error("Worker ID is required");
        }

        if (!dto.status || !["approved", "rejected"].includes(dto.status)) {
            throw new Error("Valid status (approved or rejected) is required");
        }

        const worker = await this.workerRepository.findById(dto.workerId);

        if (!worker) {
            throw new Error("Worker not found with ID: " + dto.workerId);
        }

        // Update status
        if (dto.status === "approved") {
            worker.status = WorkerStatus.APPROVED;
            
            // Clear rejection data if previously rejected
            worker.rejectionReason = undefined;
            worker.rejectedAt = undefined;

            // Send approval email
            await this.emailService.sendApprovalEmail(worker.email, worker.name);
            
        } else if (dto.status === "rejected") {
            if (!dto.rejectionReason || dto.rejectionReason.trim().length === 0) {
                throw new Error("Rejection reason is required when rejecting an application");
            }

            worker.status = WorkerStatus.REJECTED;
            worker.rejectionReason = dto.rejectionReason;
            worker.rejectedAt = new Date();
            worker.canReapply = true;

            // Send rejection email with reason
            await this.emailService.sendRejectionEmail(
                worker.email,
                worker.name,
                dto.rejectionReason
            );
        }

        console.log("WorkerApproveUseCase - Updating worker status to:", worker.status);

        const updatedWorker = await this.workerRepository.save(worker);

        return WorkerMapper.toResponseDto(updatedWorker);
    }
}