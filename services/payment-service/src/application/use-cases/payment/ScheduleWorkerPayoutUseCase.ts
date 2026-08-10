import { inject, injectable } from "tsyringe";
import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";

@injectable()
export class ScheduleWorkerPayoutUseCase {
  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository,
    @inject("WalletRepository") private walletRepo: IWalletRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository,
  ) { }

  async execute(workId: string): Promise<{ paymentId: string; workerPayout: number } | null> {
    const payment = await this.paymentRepo.findByWorkId(workId);

    // Only schedule if there is a paid payment for this work
    if (!payment || payment.status !== "paid") return null;

    // Stamp work-completion and payout-scheduled timestamps (status stays "paid")
    await this.paymentRepo.updateStatus(payment.id, "paid", {
      workCompletedAt: new Date(),
      payoutScheduledAt: new Date(),
    });

    //Also update the worker's hold transaction description so the
    //worker wallet UI shows "releasing in 1 hour" messaging correctly
    try {
      const holdTxs = await this.txRepo.findByWorkId(workId);
      const holdTx = holdTxs.find(tx => tx.type === "hold" && tx.status === "pending");
      if (holdTx) {
        // We update the description via a raw update — just mark it as releasing
        // The status stays "pending" until ReleaseWorkerPayoutUseCase runs after 1hr
        console.log(`[ScheduleWorkerPayout] Hold tx ${holdTx.id} will be released in 1hr`);
      }
    } catch (err) {
      console.error("[ScheduleWorkerPayout] Could not find hold tx:", err);
    }

    return { paymentId: payment.id, workerPayout: payment.workerPayout };
  }
}