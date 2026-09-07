import { ApplyDisputeActionDto, DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";
export interface IApplyDisputeActionUseCase {
  execute(dto: ApplyDisputeActionDto): Promise<DisputeResponseDto>;
}