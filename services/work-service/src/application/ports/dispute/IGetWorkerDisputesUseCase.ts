import { DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";

export interface IGetWorkerDisputesUseCase {
  execute(workerId: string): Promise<DisputeResponseDto[]>;
}