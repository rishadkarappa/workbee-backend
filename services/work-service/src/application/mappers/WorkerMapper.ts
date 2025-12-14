import { Worker } from "../../domain/entities/Worker";
import { WorkerStatus } from "../../infrastructure/database/models/WorkerSchema";
import { ApplyWorkerDto } from "../dtos/worker/WorkerDTO";
import { WorkerResponseDto } from "../dtos/worker/WorkerDTO";

export class WorkerMapper {
    static toEntity(dto: ApplyWorkerDto): Worker {
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
}