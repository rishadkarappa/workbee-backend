import { inject, injectable } from "tsyringe";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IScheduleWorkerPayoutUseCase } from "../../ports/worker/IScheduleWorkerPayoutUseCase";

@injectable()
export class ScheduleWorkerPayoutUseCase implements IScheduleWorkerPayoutUseCase {
  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository
  ) {}

  async execute(workId: string): Promise<{ paymentId: string; workerPayout: number } | null> {
    const payment = await this.paymentRepo.findByWorkId(workId);
    if (!payment || payment.status !== "paid") return null;

    await this.paymentRepo.updateStatus(payment.id, "paid", {
      workCompletedAt: new Date(),
      payoutScheduledAt: new Date(),
    });

    try {
      const holdTxs = await this.txRepo.findByWorkId(workId);
      const holdTx = holdTxs.find(tx => tx.type === "hold" && tx.status === "pending");
      if (holdTx) {
        console.log(`[ScheduleWorkerPayout] Hold tx ${holdTx.id} will be released in 1hr`);
      }
    } catch (err) {
      console.error("[ScheduleWorkerPayout] Could not find hold tx:", err);
    }

    return { paymentId: payment.id, workerPayout: payment.workerPayout };
  }
}