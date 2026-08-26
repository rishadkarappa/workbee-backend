import { WorkerProfileStatsResponseDto } from "../../dtos/review/ReviewDTO";

export interface IGetWorkerProfileStatsUseCase {
  execute(workerId: string): Promise<WorkerProfileStatsResponseDto>;
}