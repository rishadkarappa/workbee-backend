import { inject, injectable } from "tsyringe";

import { IPlatformEarningRepository } from "../../../domain/repositories/IPlatformEarningRepository";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IReleaseWorkerPayoutUseCase } from "../../ports/worker/IReleaseWorkerPayoutUseCase";

@injectable()
export class ReleaseWorkerPayoutUseCase implements IReleaseWorkerPayoutUseCase {
  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository,
    @inject("WalletRepository") private walletRepo: IWalletRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository,
    @inject("PlatformEarningRepository") private platformEarningRepo: IPlatformEarningRepository
  ) {}

  async execute(paymentId: string): Promise<void> {
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment || payment.status !== "paid") {
      console.log(`[ReleaseWorkerPayout] skipping ${paymentId} — status: ${payment?.status}`);
      return;
    }

    const workerWallet = await this.walletRepo.findOrCreate(payment.workerId, "worker");

    await this.walletRepo.movePendingToBalance(workerWallet.id, payment.workerPayout);
    await this.walletRepo.incrementTotalEarned(workerWallet.id, payment.workerPayout);

    await this.txRepo.create({
      walletId: workerWallet.id,
      workId: payment.workId,
      razorpayPaymentId: payment.razorpayPaymentId,
      type: "credit",
      amount: payment.workerPayout,
      currency: payment.currency,
      status: "completed",
      description: `Payout for completed work ${payment.workId}`,
      metadata: { platformFee: payment.platformFee, totalAmount: payment.amount },
    });

    // Audit-only row. type "platform_fee" is filtered out by TransactionMapper
    // for non-admin wallet views — see WalletMapper.
    await this.txRepo.create({
      walletId: workerWallet.id,
      workId: payment.workId,
      type: "platform_fee",
      amount: payment.platformFee,
      currency: payment.currency,
      status: "completed",
      description: `1% platform fee for work ${payment.workId}`,
    });

    await this.platformEarningRepo.create({
      paymentId: payment.id,
      workId: payment.workId,
      feeAmount: payment.platformFee,
      currency: payment.currency,
    });

    await this.paymentRepo.updateStatus(payment.id, "worker_credited", {
      payoutCompletedAt: new Date(),
    });

    try {
      const holdTxs = await this.txRepo.findByWorkId(payment.workId);
      const holdTx = holdTxs.find(tx => tx.type === "hold" && tx.status === "pending");
      if (holdTx) {
        await this.txRepo.updateStatus(holdTx.id, "completed");
      }
    } catch (err) {
      console.error("[ReleaseWorkerPayout] Could not update hold tx status:", err);
    }

    console.log(`[ReleaseWorkerPayout] Released ₹${payment.workerPayout} to worker ${payment.workerId}`);
  }
}