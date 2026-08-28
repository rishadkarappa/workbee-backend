import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { WorkerStatus } from "../../../infrastructure/database/models/WorkerSchema";
import { IGetAdminWorkStatsUseCase } from "../../ports/admin/IGetAdminWorkStatsUseCase";
import { AdminWorkStatsResponseDto } from "../../dtos/admin/AdminWorkStatsDTO";

@injectable()
export class GetAdminWorkStatsUseCase implements IGetAdminWorkStatsUseCase {
    constructor(
        @inject("WorkerRepository") private readonly _workerRepository: IWorkerRepository,
        @inject("WorkRepository") private readonly _workRepository: IWorkRepository
    ) { }

    async execute(): Promise<AdminWorkStatsResponseDto> {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [
            totalWorkers,
            newWorkersThisMonth,
            newWorkersLastMonth,
            newAppliersCount,
            activeJobsCount,
            worksCompletedTotal
        ] = await Promise.all([
            this._workerRepository.getWorkersCount(),
            this._workerRepository.countCreatedBetween(WorkerStatus.APPROVED, startOfThisMonth, now),
            this._workerRepository.countCreatedBetween(WorkerStatus.APPROVED, startOfLastMonth, startOfThisMonth),
            this._workerRepository.countPendingAppliers(),
            this._workRepository.countAllActive(),
            this._workRepository.countAllCompleted(),
        ]);

        return {
            totalWorkers,
            newWorkersThisMonth,
            newWorkersLastMonth,
            newAppliersCount,
            activeJobsCount,
            worksCompletedTotal
        };
    }
}