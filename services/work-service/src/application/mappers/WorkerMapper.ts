import { Worker } from "../../domain/entities/Worker";
import { ApplyWorkerDto } from "../dtos/WorkerDTO";
import { WorkerResponseDto } from "../dtos/WorkerDTO";

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
            isApproved: false,
            isBlocked: false
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
            isApproved: entity.isApproved || false,
            isBlocked: entity.isBlocked || false,
            createdAt: entity.createdAt || new Date(),
            updatedAt: entity.updatedAt || new Date()
        };
    }

    static toResponseDtoList(entities: Worker[]): WorkerResponseDto[] {
        return entities.map(entity => this.toResponseDto(entity));
    }
}