import { WorkerEarningsStatsResponseDto } from "../../dtos/worker/WorkerEarningsStatsDTO";

export interface IGetWorkerEarningsStatsUseCase {
    execute(workerId: string): Promise<WorkerEarningsStatsResponseDto>;
}