import { inject, injectable } from "tsyringe";
import { IDisputeRepository } from "../../../domain/repositories/IDisputeRepository";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { ApplyDisputeActionDto, DisputeResponseDto } from "../../dtos/dispute/DisputeDTO";
import { DisputeMapper } from "../../mappers/DisputeMapper";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";
import { IApplyDisputeActionUseCase } from "../../ports/dispute/IApplyDisputeActionUseCase";
import { IEmailService } from "../../../domain/services/IEmailService";
import { IWorkerEventPublisher } from "../../../domain/message-bus/IWorkerEventPublisher";
import { IUserDisputeActionClient } from "../../../domain/message-bus/IUserDisputeActionClient";
import { DisputeStatus, DisputeActionType } from "../../../domain/entities/Dispute";

@injectable()
export class ApplyDisputeActionUseCase implements IApplyDisputeActionUseCase {
  constructor(
    @inject("DisputeRepository") private readonly _disputeRepository: IDisputeRepository,
    @inject("WorkerRepository") private readonly _workerRepository: IWorkerRepository,
    @inject("EmailService") private readonly _emailService: IEmailService,
    @inject("WorkerEventPublisher") private readonly _workerEventPublisher: IWorkerEventPublisher,
    @inject("UserDisputeActionClient") private readonly _userDisputeActionClient: IUserDisputeActionClient
  ) {}

  private resolveStatus(actionType: DisputeActionType): DisputeStatus {
    return actionType === "no_action" ? "dismissed" : "resolved";
  }

  async execute(dto: ApplyDisputeActionDto): Promise<DisputeResponseDto> {
    const dispute = await this._disputeRepository.findById(dto.disputeId);
    if (!dispute) throw new Error(ErrorMessages.DISPUTE.DISPUTE_NOT_FOUND);

    if (!dto.reason || dto.reason.trim().length < 5) {
      throw new Error(ErrorMessages.DISPUTE.REASON_REQUIRED);
    }

    switch (dto.actionType) {
      case "block_worker":
      case "unblock_worker": {
        const isBlocked = dto.actionType === "block_worker";
        const worker = await this._workerRepository.findById(dispute.workerId);
        if (!worker) throw new Error(ErrorMessages.WORKER.WORKER_NOT_FOUND);
        await this._workerRepository.save({ ...worker, isBlocked });
        await this._workerEventPublisher.publishWorkerBlocked({ workerId: dispute.workerId, isBlocked });
        break;
      }

      case "blacklist_worker":
      case "unblacklist_worker": {
        const isBlacklisted = dto.actionType === "blacklist_worker";
        const worker = await this._workerRepository.findById(dispute.workerId);
        if (!worker) throw new Error(ErrorMessages.WORKER.WORKER_NOT_FOUND);

        await this._workerRepository.save({
          ...worker,
          isBlacklisted,
          isBlocked: isBlacklisted ? true : worker.isBlocked,
          ...(isBlacklisted ? { blacklistReason: dto.reason, blacklistedAt: new Date() } : {}),
        });
        await this._workerEventPublisher.publishWorkerBlocked({ workerId: dispute.workerId, isBlocked: isBlacklisted });

        if (isBlacklisted) {
          await this._emailService.sendBlacklistedEmail(worker.email, worker.name, dto.reason);
        }
        break;
      }

      case "warning_email_worker": {
        const worker = await this._workerRepository.findById(dispute.workerId);
        if (!worker) throw new Error(ErrorMessages.WORKER.WORKER_NOT_FOUND);
        await this._emailService.sendWarningEmail(worker.email, worker.name, dto.reason);
        break;
      }

      case "block_user":
      case "unblock_user": {
        const isBlock = dto.actionType === "block_user";
        const res = await this._userDisputeActionClient.applyAction({
          userId: dispute.userId,
          actionType: isBlock ? "block" : "unblock",
          reason: dto.reason,
        });
        if (!res.success) throw new Error(res.error || ErrorMessages.DISPUTE.ACTION_FAILED);
        break;
      }

      case "blacklist_user":
      case "unblacklist_user": {
        const isBlacklist = dto.actionType === "blacklist_user";
        const res = await this._userDisputeActionClient.applyAction({
          userId: dispute.userId,
          actionType: isBlacklist ? "blacklist" : "unblacklist",
          reason: dto.reason,
        });
        if (!res.success) throw new Error(res.error || ErrorMessages.DISPUTE.ACTION_FAILED);
        break;
      }

      case "warning_email_user": {
        const res = await this._userDisputeActionClient.applyAction({
          userId: dispute.userId,
          actionType: "warning_email",
          reason: dto.reason,
        });
        if (!res.success) throw new Error(res.error || ErrorMessages.DISPUTE.ACTION_FAILED);
        break;
      }

      case "no_action":
        break;

      default:
        throw new Error(ErrorMessages.DISPUTE.INVALID_ACTION_TYPE);
    }

    const updated = await this._disputeRepository.addAction(
      dto.disputeId,
      { actionType: dto.actionType, reason: dto.reason.trim(), takenBy: dto.adminId, takenAt: new Date() },
      this.resolveStatus(dto.actionType)
    );

    if (!updated) throw new Error(ErrorMessages.DISPUTE.DISPUTE_NOT_FOUND);
    return DisputeMapper.toResponseDto(updated);
  }
}