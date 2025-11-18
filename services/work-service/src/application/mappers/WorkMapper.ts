import { Work } from "../../domain/entities/Work";
import { PostWorkDto } from "../dtos/WorkDTO";
import { WorkResponseDto } from "../dtos/WorkDTO";

export class WorkMapper {
    static toEntity(dto: PostWorkDto): Work {
        return {
            userId: dto.userId,
            workTitle: dto.workTitle,
            workCategory: dto.workCategory,
            workType: dto.workType,
            date: dto.date,
            startDate: dto.startDate,
            endDate: dto.endDate,
            time: dto.time,
            description: dto.description,
            duration: dto.duration,
            budget: dto.budget,
            currentLocation: dto.currentLocation,
            manualAddress: dto.manualAddress,
            landmark: dto.landmark,
            place: dto.place,
            contactNumber: dto.contactNumber,
            petrolAllowance: dto.petrolAllowance,
            extraRequirements: dto.extraRequirements,
            anythingElse: dto.anythingElse,
            termsAccepted: dto.termsAccepted,
            status: 'pending'
        };
    }

    static toResponseDto(entity: Work): WorkResponseDto {
        return {
            id: entity.id!,
            userId: entity.userId,
            workTitle: entity.workTitle,
            workCategory: entity.workCategory,
            workType: entity.workType,
            date: entity.date,
            startDate: entity.startDate,
            endDate: entity.endDate,
            time: entity.time,
            description: entity.description,
            voiceFile: entity.voiceFile,
            videoFile: entity.videoFile,
            duration: entity.duration,
            budget: entity.budget,
            currentLocation: entity.currentLocation,
            manualAddress: entity.manualAddress,
            landmark: entity.landmark,
            place: entity.place,
            contactNumber: entity.contactNumber,
            beforeImage: entity.beforeImage,
            petrolAllowance: entity.petrolAllowance,
            extraRequirements: entity.extraRequirements,
            anythingElse: entity.anythingElse,
            status: entity.status,
            createdAt: entity.createdAt || new Date(),
            updatedAt: entity.updatedAt || new Date()
        };
    }

    static toResponseDtoList(entities: Work[]): WorkResponseDto[] {
        return entities.map(entity => this.toResponseDto(entity));
    }
}
