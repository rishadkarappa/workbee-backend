import { inject, injectable } from "tsyringe";
import { IWorkRepository } from "../../domain/repositories/IWorkRepository";

import { WorkMapper } from "../mappers/WorkMapper";
import { PostWorkDto, WorkResponseDto } from "../dtos/work/WorkDTO";

import { IPostWorkUseCase } from "../ports/work/IPostWorkUseCase";

@injectable()
export class PostWorkUseCase implements IPostWorkUseCase{
    constructor(
        @inject("WorkRepository") private workRepository: IWorkRepository
    ) {}

    async execute(dto: PostWorkDto): Promise<WorkResponseDto> {
        // Validate required fields
        if (!dto.userId) {
            throw new Error("User ID is required");
        }

        if (!dto.workTitle || !dto.workCategory || !dto.contactNumber) {
            throw new Error("Please fill all required fields");
        }

        if (!dto.workType) {
            throw new Error("Please select work duration type");
        }

        // Validate work type specific fields
        if (dto.workType === 'oneDay' && !dto.date) {
            throw new Error("Date is required for one day work");
        }

        if (dto.workType === 'multipleDay' && (!dto.startDate || !dto.endDate)) {
            throw new Error("Start date and end date are required for multiple day work");
        }

        if (!dto.time) {
            throw new Error("Time is required");
        }

        if (!dto.termsAccepted) {
            throw new Error("Please accept terms and conditions");
        }

        // Validate description minimum length
        if (dto.description && dto.description.split(' ').length < 2) {
            throw new Error("Description must be at least 3 words");
        }

       

        const work = WorkMapper.toEntity(dto);
        const createdWork = await this.workRepository.create(work);
        return WorkMapper.toResponseDto(createdWork);
    }
}