import { inject, injectable } from "tsyringe";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { WorkResponseDto } from "../../dtos/work/WorkDTO";
import { WorkMapper } from "../../mappers/WorkMapper";
import { IGetAllWorksUseCase } from "../../ports/work/IGetAllWorksUseCase";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class GetAllWorksUseCase implements IGetAllWorksUseCase {
    constructor(
        @inject("WorkRepository") private readonly _workRepository: IWorkRepository
    ) { }

    async execute(filters?: {
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
        latitude?: number;
        longitude?: number;
        maxDistance?: number;
    }): Promise<{ works: WorkResponseDto[]; total: number; totalPages: number }> {
        const { works, total } = await this._workRepository.findAll(filters);

        if (!works) {
            throw new Error(ErrorMessages.WORK.FAILED_TO_RETRIEVE_WORKS);
        }

        const limit = filters?.limit || 10;
        const totalPages = Math.ceil(total / limit);

        return { works: WorkMapper.toResponseDtoList(works), total, totalPages };
    }
}
