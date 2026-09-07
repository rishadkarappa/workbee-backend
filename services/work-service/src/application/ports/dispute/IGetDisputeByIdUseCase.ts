import { DisputeDetailResponseDto } from "../../dtos/dispute/DisputeDTO";

export interface IGetDisputeByIdUseCase {
  execute(disputeId: string): Promise<DisputeDetailResponseDto>;
}