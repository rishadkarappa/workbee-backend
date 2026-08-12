import { inject, injectable } from "tsyringe";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { IGetWorkerAssignedWorksUseCase } from "../../ports/isc/IGetWorkerAssignedWorksUseCase";
import { GetWorkerAssignedWorksDto, GetWorkerAssignedWorksResponseDto } from "../../dtos/worker/GetWorkerAssignedWorks.dtos";

@injectable()
export class GetWorkerAssignedWorksUseCase implements IGetWorkerAssignedWorksUseCase {
    constructor(
        @inject("WorkRepository") private readonly _workRepository: IWorkRepository
    ) { }

    async execute(dto: GetWorkerAssignedWorksDto): Promise<GetWorkerAssignedWorksResponseDto[]> {
        const { workerId } = dto;
        const { works } = await this._workRepository.findByWorkerId(workerId);

        return works.map((work): GetWorkerAssignedWorksResponseDto => ({
            id: work.id!,
            userId: work.userId, 
            workTitle: work.workTitle,
            workCategory: work.workCategory,
            workType: work.workType,
            status: work.status,
            progress: work.progress,
            budget: work.budget ? Number(work.budget) : undefined,
            startDate: work.startDate,
            endDate: work.endDate,
            description: work.description,
            manualAddress: work.manualAddress,
            createdAt: work.createdAt!,
        }));
    }
}