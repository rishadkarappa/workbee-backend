import { inject, injectable } from "tsyringe";
import { IDisputeRepository } from "../../../domain/repositories/IDisputeRepository";
import { GetAllDisputesFilterDto, DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";
import { DisputeMapper } from "../../mappers/DisputeMapper";
import { IGetAllDisputesUseCase } from "../../ports/dispute/IGetAllDisputesUseCase";

@injectable()
export class GetAllDisputesUseCase implements IGetAllDisputesUseCase {
  constructor(@inject("DisputeRepository") private readonly _disputeRepository: IDisputeRepository) {}

  async execute(filters: GetAllDisputesFilterDto): Promise<{ disputes: DisputeResponseDto[]; total: number }> {
    const { disputes, total } = await this._disputeRepository.findAll(filters);
    return { disputes: disputes.map(DisputeMapper.toResponseDto), total };
  }
}