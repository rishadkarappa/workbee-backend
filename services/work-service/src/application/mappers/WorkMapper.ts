import { Work } from "../../domain/entities/Work";
import { PostWorkDto } from "../dtos/work/WorkDTO";
import { WorkResponseDto } from "../dtos/work/WorkDTO";

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
            location:{
                type:'Point',
                coordinates:[dto.longitude, dto.latitude]
            },
            currentLocation: dto.currentLocation,
            manualAddress: dto.manualAddress,
            landmark: dto.landmark,
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
            location: entity.location,
            currentLocation: entity.currentLocation,
            manualAddress: entity.manualAddress,
            landmark: entity.landmark,
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
