import { inject, injectable } from "tsyringe";

import { IWorkRepository } from "../../domain/repositories/IWorkRepository";
import { Work } from "../../domain/entities/Work";
import { WorkResponseDto } from "../dtos/WorkDTO";
import { WorkMapper } from "../mappers/WorkMapper";
import { IGetAllWorksUseCase } from "../ports/work/IGetAllWorksUseCase";

@injectable()
export class GetAllWorksUseCase implements IGetAllWorksUseCase{
    constructor(
        @inject("WorkRepository") private workRepository: IWorkRepository
    ) {}

    async execute(): Promise<WorkResponseDto[]> {
        const works = await this.workRepository.findAll();
        if (!works) {
            throw new Error("Failed to retrieve works");
        }
        return WorkMapper.toResponseDtoList(works);
    }
}