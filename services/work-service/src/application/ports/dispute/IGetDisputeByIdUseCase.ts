import { DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";
export interface IGetDisputeByIdUseCase {
  execute(disputeId: string): Promise<DisputeResponseDto>;
}