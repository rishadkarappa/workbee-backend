// import { inject, injectable } from "tsyringe";
// import { IUpdateWorkUseCase } from "../../ports/user/IUpdateWorkUseCase";
// import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
// import { UpdateWorkDto, WorkResponseDto } from "../../dtos/work/WorkDTO";
// import { WorkMapper } from "../../mappers/WorkMapper";

// @injectable()
// export class UpdateWorkUseCase implements IUpdateWorkUseCase {
//     constructor(
//         @inject("WorkRepository") private _workRepository: IWorkRepository
//     ) {}

//     async execute(dto: UpdateWorkDto): Promise<WorkResponseDto> {
//         const existingWork = await this._workRepository.findById(dto.workId);

//         if (!existingWork) {
//             throw new Error("Work not found");
//         }

//         const isWorkerProgressUpdate =
//             dto.progress !== undefined ||
//             dto.status === "in-progress" ||
//             dto.status === "completed";

//         if (isWorkerProgressUpdate) {
//             if (String(existingWork.workerId) !== String(dto.userId)) {
//                 throw new Error("You do not have permission to update this work");
//             }
//         } else {
//             if (String(existingWork.userId) !== String(dto.userId)) {
//                 throw new Error("You do not have permission to update this work");
//             }
//         }

//         const { workId, userId, ...updateData } = dto;

//         const updatedWork = await this._workRepository.update(
//             workId,
//             updateData
//         );

//         if (!updatedWork) {
//             throw new Error("Failed to update work");
//         }

//         return WorkMapper.toResponseDto(updatedWork);
//     }
// }

// PATCH: WorkService/src/application/use-cases/user/UpdateWorkUseCase.ts
//
// When a worker marks progress as 'completed', we must notify the payment service
// so it can schedule the 1-hour payout release.
//
// Add an HTTP call to the payment service after saving the work update.
// This uses axios directly — no need for a new service dependency.
//
// Replace the full UpdateWorkUseCase with this version:

import { inject, injectable } from "tsyringe";
import axios from "axios";
import { IUpdateWorkUseCase } from "../../ports/user/IUpdateWorkUseCase";
import { IWorkRepository } from "../../../domain/repositories/IWorkRepository";
import { UpdateWorkDto, WorkResponseDto } from "../../dtos/work/WorkDTO";
import { WorkMapper } from "../../mappers/WorkMapper";

@injectable()
export class UpdateWorkUseCase implements IUpdateWorkUseCase {
  constructor(
    @inject("WorkRepository") private _workRepository: IWorkRepository
  ) {}

  async execute(dto: UpdateWorkDto): Promise<WorkResponseDto> {
    const existingWork = await this._workRepository.findById(dto.workId);

    if (!existingWork) {
      throw new Error("Work not found");
    }

    const isWorkerProgressUpdate =
      dto.progress !== undefined ||
      dto.status === "in-progress"  ||
      dto.status === "completed";

    if (isWorkerProgressUpdate) {
      if (String(existingWork.workerId) !== String(dto.userId)) {
        throw new Error("You do not have permission to update this work");
      }
    } else {
      if (String(existingWork.userId) !== String(dto.userId)) {
        throw new Error("You do not have permission to update this work");
      }
    }

    const { workId, userId, ...updateData } = dto;

    const updatedWork = await this._workRepository.update(workId, updateData);

    if (!updatedWork) {
      throw new Error("Failed to update work");
    }

    // ── Notify payment service when work is completed ─────────────────────
    // This triggers the 1-hour delayed payout to the worker
    if (dto.progress === "completed" || dto.status === "completed") {
      this._notifyPaymentService(workId).catch((err) => {
        // Non-blocking — log but don't fail the work update
        console.error("[UpdateWorkUseCase] Failed to notify payment service:", err.message);
      });
    }

    return WorkMapper.toResponseDto(updatedWork);
  }

  private async _notifyPaymentService(workId: string): Promise<void> {
    const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL;
    if (!paymentServiceUrl) {
      console.warn("[UpdateWorkUseCase] PAYMENT_SERVICE_URL not set — skipping payment notification");
      return;
    }

    await axios.post(
      `${paymentServiceUrl}/payment/work-completed`,
      { workId },
      { timeout: 5000 }
    );
    console.log(`[UpdateWorkUseCase] Notified payment service for completed work ${workId}`);
  }
}