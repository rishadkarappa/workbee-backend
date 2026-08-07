import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { IEmailService } from "../../../domain/services/IEmailService";
import { WorkerApproveDto, WorkerResponseDto } from "../../dtos/worker/WorkerDTO";
import { WorkerMapper } from "../../mappers/WorkerMapper";
import { IWorkerApproveUseCase } from "../../ports/worker/IWorkerApproveUseCase";
import { WorkerStatus } from "../../../infrastructure/database/models/WorkerSchema";
import { logger } from "../../../infrastructure/logger/logger";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class WorkerApproveUseCase implements IWorkerApproveUseCase {
    constructor(
        @inject("WorkerRepository") private readonly _workerRepository: IWorkerRepository,
        @inject("EmailService") private readonly _emailService: IEmailService
    ) { }

    async execute(dto: WorkerApproveDto): Promise<WorkerResponseDto> {
        if (!dto.workerId) {
            throw new Error(ErrorMessages.WORKER.WORKER_ID_REQUIRED);
        }

        if (!dto.status || !["approved", "rejected"].includes(dto.status)) {
            throw new Error(ErrorMessages.APPLY.VALID_STATUS_REQUIRED);
        }

        const worker = await this._workerRepository.findById(dto.workerId);

        if (!worker) {
            logger.error("Worker not found with ID: " + dto.workerId)
            throw new Error(ErrorMessages.WORKER.WORKER_NOT_FOUND + dto.workerId);
        }

        if (dto.status === WorkerStatus.APPROVED) {

            worker.status = WorkerStatus.APPROVED;
            // Clear rejection data if previously rejected
            worker.rejectionReason = undefined;
            worker.rejectedAt = undefined;

            await this._emailService.sendApprovalEmail(worker.email, worker.name);

        } else if (dto.status === "rejected") {
            if (!dto.rejectionReason || dto.rejectionReason.trim().length === 0) {
                logger.error("Rejection reason is required when rejecting an application")
                throw new Error(ErrorMessages.APPLY.REJUCTION_REASON_REQUIRED);
            }

            worker.status = WorkerStatus.REJECTED;
            worker.rejectionReason = dto.rejectionReason;
            worker.rejectedAt = new Date();
            worker.canReapply = true;

            await this._emailService.sendRejectionEmail(worker.email, worker.name, dto.rejectionReason);
        }

        logger.log("WorkerApproveUseCase - Updating worker status to:", worker.status);

        const updatedWorker = await this._workerRepository.save(worker);

        return WorkerMapper.toResponseDto(updatedWorker);
    }
}