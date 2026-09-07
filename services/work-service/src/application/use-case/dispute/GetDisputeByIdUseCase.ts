import { inject, injectable } from "tsyringe";
import { IDisputeRepository } from "../../../domain/repositories/IDisputeRepository";
import { DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";
import { DisputeMapper } from "../../mappers/DisputeMapper";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { IGetDisputeByIdUseCase } from "../../ports/dispute/IGetDisputeByIdUseCase";

@injectable()
export class GetDisputeByIdUseCase implements IGetDisputeByIdUseCase {
  constructor(@inject("DisputeRepository") private readonly _disputeRepository: IDisputeRepository) {}

  async execute(disputeId: string): Promise<DisputeResponseDto> {
    const dispute = await this._disputeRepository.findById(disputeId);
    if (!dispute) throw new Error(ErrorMessages.DISPUTE.DISPUTE_NOT_FOUND);
    return DisputeMapper.toResponseDto(dispute);
  }
}