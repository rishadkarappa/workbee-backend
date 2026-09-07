import { GetAllDisputesFilterDto, DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";
export interface IGetAllDisputesUseCase {
  execute(filters: GetAllDisputesFilterDto): Promise<{ disputes: DisputeResponseDto[]; total: number }>;
}