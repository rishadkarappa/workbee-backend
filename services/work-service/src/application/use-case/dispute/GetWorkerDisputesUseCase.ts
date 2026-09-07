import { inject, injectable } from "tsyringe";
import { IDisputeRepository } from "../../../domain/repositories/IDisputeRepository";
import { DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";
import { DisputeMapper } from "../../mappers/DisputeMapper";
import { IGetWorkerDisputesUseCase } from "../../ports/dispute/IGetWorkerDisputesUseCase";

@injectable()
export class GetWorkerDisputesUseCase implements IGetWorkerDisputesUseCase {
  constructor(@inject("DisputeRepository") private readonly _disputeRepository: IDisputeRepository) {}

  async execute(workerId: string): Promise<DisputeResponseDto[]> {
    const disputes = await this._disputeRepository.findByWorkerId(workerId);
    return disputes.map(DisputeMapper.toResponseDto);
  }
}