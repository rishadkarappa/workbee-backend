import { Dispute } from "../../domain/entities/Dispute";
import { DisputeResponseDto, DisputeDetailResponseDto, WorkerSummaryDto, UserSummaryDto } from "../dtos/dispute/DisputeDTO";

export class DisputeMapper {
  static toResponseDto(dispute: Dispute): DisputeResponseDto {
    return {
      id: dispute.id,
      workId: dispute.workId,
      workTitle: dispute.workTitle,
      userId: dispute.userId,
      workerId: dispute.workerId,
      complaintType: dispute.complaintType,
      description: dispute.description,
      proofImages: dispute.proofImages,
      proofVideo: dispute.proofVideo,
      status: dispute.status,
      actions: dispute.actions,
      createdAt: dispute.createdAt,
      updatedAt: dispute.updatedAt,
    };
  }


  static toDetailResponseDto(
    dispute: Dispute,
    worker: WorkerSummaryDto,
    user: UserSummaryDto
  ): DisputeDetailResponseDto {
    return { ...this.toResponseDto(dispute), worker, user };
  }
}