import { NewWorker, Worker } from "../../domain/entities/Worker";
import { WorkerStatus } from "../../infrastructure/database/models/WorkerSchema";
import { WorkerProfileResponseDTO } from "../dtos/worker/UpdateWorkerProfileDTO";
import { ApplyWorkerDto } from "../dtos/worker/WorkerDTO";
import { WorkerResponseDto } from "../dtos/worker/WorkerDTO";

export class WorkerMapper {
    static toEntity(dto: ApplyWorkerDto): NewWorker {
        return {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            password: dto.password,
            location: dto.location,
            workType: dto.workType,
            preferredWorks: dto.preferredWorks,
            confirmations: dto.confirmations,
            status: WorkerStatus.PENDING,
            isBlocked: false,
            canReapply: true
        };
    }

    static toResponseDto(entity: Worker): WorkerResponseDto {
        return {
            id: entity.id!,
            name: entity.name,
            email: entity.email,
            phone: entity.phone,
            password: entity.password, 
            location: entity.location,
            workType: entity.workType,
            preferredWorks: entity.preferredWorks,
            confirmations: entity.confirmations,
            status: entity.status,
            isBlocked: entity.isBlocked || false,
            rejectionReason: entity.rejectionReason,
            rejectedAt: entity.rejectedAt,
            canReapply: entity.canReapply,
            createdAt: entity.createdAt || new Date(),
            updatedAt: entity.updatedAt || new Date()
        };
    }

    static toResponseDtoList(entities: Worker[]): WorkerResponseDto[] {
        return entities.map(entity => this.toResponseDto(entity));
    }

    static toProfileResponse(worker: Worker): WorkerProfileResponseDTO {
        return {
            id: worker.id,
            name: worker.name,
            email: worker.email,
            phone: worker.phone,
            location: worker.location,
            workType: worker.workType,
            preferredWorks: worker.preferredWorks,
            bio: worker.bio,
            workerProfileImage: worker.workerProfileImage,
            status: worker.status,
            createdAt: worker.createdAt,
            updatedAt: worker.updatedAt,
        };
    }
}