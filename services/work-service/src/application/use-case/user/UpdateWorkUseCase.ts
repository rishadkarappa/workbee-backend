import { inject, injectable } from "tsyringe";
import { IUpdateWorkUseCase } from "../../ports/user/IUpdateWorkUseCase";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { UpdateWorkDto, WorkResponseDto } from "../../dtos/work/WorkDTO";
import { WorkMapper } from "../../mappers/WorkMapper";

@injectable()
export class UpdateWorkUseCase implements IUpdateWorkUseCase {
    constructor(
        @inject("WorkRepository") private workRepository: IWorkRepository
    ) {}

    async execute(dto: UpdateWorkDto): Promise<WorkResponseDto> {
        const existingWork = await this.workRepository.findById(dto.workId);
        
        if (!existingWork) {
            throw new Error('Work not found');
        }

        if (existingWork.userId !== dto.userId) {
            throw new Error('You do not have permission to update this work');
        }

        const { workId, userId, ...updateData } = dto;

        const updatedWork = await this.workRepository.update(workId, updateData);
        
        if (!updatedWork) {
            throw new Error('Failed to update work');
        }

        return WorkMapper.toResponseDto(updatedWork);
    }
}