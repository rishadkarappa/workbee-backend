import { ScheduleWorkerPayoutRequestDTO } from "../../dtos/worker/WorkerPayoutDTO";
import { ScheduleWorkerPayoutResponseDTO } from "../../dtos/worker/WorkerPayoutDTO";

export interface IScheduleWorkerPayoutUseCase {
  execute(data: ScheduleWorkerPayoutRequestDTO): Promise<ScheduleWorkerPayoutResponseDTO>;
}