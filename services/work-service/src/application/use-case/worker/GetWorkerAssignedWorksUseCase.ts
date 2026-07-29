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
            workTitle: work.workTitle,
            workCategory: work.workCategory,
            status: work.status,
            budget: work.budget ? Number(work.budget) : undefined,
            createdAt: work.createdAt!,
        }));
    }
}