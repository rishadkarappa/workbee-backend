import { CreateDisputeDto, DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";

export interface ICreateDisputeUseCase {
  execute(dto: CreateDisputeDto): Promise<DisputeResponseDto>;
}