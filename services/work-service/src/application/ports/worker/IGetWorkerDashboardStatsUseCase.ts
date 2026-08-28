import { WorkerDashboardStatsResponseDto } from "../../dtos/worker/WorkerDashboardStatsDTO";

export interface IGetWorkerDashboardStatsUseCase {
    execute(workerId: string): Promise<WorkerDashboardStatsResponseDto>;
}