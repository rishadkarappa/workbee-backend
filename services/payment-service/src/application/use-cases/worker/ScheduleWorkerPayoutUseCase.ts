import { inject, injectable } from "tsyringe";

import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IScheduleWorkerPayoutUseCase } from "../../ports/worker/IScheduleWorkerPayoutUseCase";

import { ScheduleWorkerPayoutRequestDTO,ScheduleWorkerPayoutResponseDTO } from "../../dtos/worker/WorkerPayoutDTO";

@injectable()
export class ScheduleWorkerPayoutUseCase implements IScheduleWorkerPayoutUseCase {
  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository
  ) {}

  async execute(data: ScheduleWorkerPayoutRequestDTO): Promise<ScheduleWorkerPayoutResponseDTO> {
    const payment = await this.paymentRepo.findByWorkId(data.workId);
    if (!payment || payment.status !== "paid") {
      return { scheduled: false };
    }

    await this.paymentRepo.updateStatus(payment.id, "paid", {
      workCompletedAt: new Date(),
      payoutScheduledAt: new Date(),
    });

    try {
      const holdTxs = await this.txRepo.findByWorkId(data.workId);
      const holdTx = holdTxs.find(tx => tx.type === "hold" && tx.status === "pending");
      if (holdTx) {
        console.log(`[ScheduleWorkerPayout] Hold tx ${holdTx.id} will be released in 1hr`);
      }
    } catch (err) {
      console.error("[ScheduleWorkerPayout] Could not find hold tx:", err);
    }

    return { scheduled: true, paymentId: payment.id, workerPayout: payment.workerPayout };
  }
}