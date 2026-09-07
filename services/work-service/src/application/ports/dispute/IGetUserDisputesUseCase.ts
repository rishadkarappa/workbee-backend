import { DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";

export interface IGetUserDisputesUseCase {
  execute(userId: string): Promise<DisputeResponseDto[]>;
}