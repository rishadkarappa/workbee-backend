import { inject, injectable } from "tsyringe";
import { IDisputeRepository } from "../../../domain/repositories/IDisputeRepository";
import { DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";
import { DisputeMapper } from "../../mappers/DisputeMapper";
import { IGetUserDisputesUseCase } from "../../ports/dispute/IGetUserDisputesUseCase";

@injectable()
export class GetUserDisputesUseCase implements IGetUserDisputesUseCase {
  constructor(@inject("DisputeRepository") private readonly _disputeRepository: IDisputeRepository) {}

  async execute(userId: string): Promise<DisputeResponseDto[]> {
    const disputes = await this._disputeRepository.findByUserId(userId);
    return disputes.map(DisputeMapper.toResponseDto);
  }
}