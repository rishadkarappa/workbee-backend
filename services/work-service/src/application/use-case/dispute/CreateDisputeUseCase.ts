import { inject, injectable } from "tsyringe";
import { IDisputeRepository } from "../../../domain/repositories/IDisputeRepository";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { CreateDisputeDto, DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";
import { DisputeMapper } from "../../mappers/DisputeMapper";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { ICreateDisputeUseCase } from "../../ports/dispute/ICreateDisputeUseCase";

@injectable()
export class CreateDisputeUseCase implements ICreateDisputeUseCase {
  constructor(
    @inject("DisputeRepository") private readonly _disputeRepository: IDisputeRepository,
    @inject("WorkRepository") private readonly _workRepository: IWorkRepository
  ) {}

  async execute(dto: CreateDisputeDto): Promise<DisputeResponseDto> {
    if (!dto.complaintType) {
      throw new Error(ErrorMessages.DISPUTE.COMPLAINT_TYPE_REQUIRED);
    }
    if (!dto.description || dto.description.trim().length < 10) {
      throw new Error(ErrorMessages.DISPUTE.DESCRIPTION_TOO_SHORT);
    }
    if (dto.proofImages && dto.proofImages.length > 2) {
      throw new Error(ErrorMessages.DISPUTE.TOO_MANY_IMAGES);
    }

    const work = await this._workRepository.findById(dto.workId);
    if (!work) throw new Error(ErrorMessages.WORK.WORK_NOT_FOUND);

    // same ownership check pattern as CreateReviewUseCase
    if (String(work.userId) !== String(dto.userId)) {
      throw new Error(ErrorMessages.WORK.DONT_HAVE_PERMISSION_TO_UPDATE);
    }

    const created = await this._disputeRepository.create({
      workId: dto.workId,
      workTitle: work.workTitle,
      userId: dto.userId,
      workerId: dto.workerId,
      complaintType: dto.complaintType,
      description: dto.description.trim(),
      proofImages: dto.proofImages || [],
      proofVideo: dto.proofVideo,
    });

    return DisputeMapper.toResponseDto(created);
  }
}