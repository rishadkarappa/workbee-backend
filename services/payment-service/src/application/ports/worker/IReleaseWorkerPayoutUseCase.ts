import { ReleaseWorkerPayoutRequestDTO } from "../../dtos/worker/WorkerPayoutDTO";
import { ReleaseWorkerPayoutResponseDTO } from "../../dtos/worker/WorkerPayoutDTO";

export interface IReleaseWorkerPayoutUseCase {
  execute(data: ReleaseWorkerPayoutRequestDTO): Promise<ReleaseWorkerPayoutResponseDTO>;
}