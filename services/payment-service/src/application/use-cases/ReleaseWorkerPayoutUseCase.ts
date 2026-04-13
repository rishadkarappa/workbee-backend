import { inject, injectable } from "tsyringe";

import { IPlatformEarningRepository } from "../../domain/repositories/IPlatformEarningRepository";
import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";

@injectable()
export class ReleaseWorkerPayoutUseCase {
    constructor(
        @inject("PaymentRepository") private paymentRepo: IPaymentRepository,
        @inject("WalletRepository") private walletRepo: IWalletRepository,
        @inject("TransactionRepository") private txRepo: ITransactionRepository,
        @inject("PlatformEarningRepository") private platformEarningRepo: IPlatformEarningRepository
    ) { }

    async execute(paymentId: string): Promise<void> {
        const payment = await this.paymentRepo.findById(paymentId);
        if (!payment || payment.status !== "paid") {
            console.log(`[ReleaseWorkerPayout] skipping ${paymentId} — status: ${payment?.status}`);
            return;
        }

        const workerWallet = await this.walletRepo.findOrCreate(payment.workerId, "worker");

        // Move pending balance to available balance
        await this.walletRepo.movePendingToBalance(workerWallet.id, payment.workerPayout);
        await this.walletRepo.incrementTotalEarned(workerWallet.id, payment.workerPayout);

        // Credit transaction — worker sees this as "Payment credited to wallet"
        await this.txRepo.create({
            walletId: workerWallet.id,
            workId: payment.workId,
            razorpayPaymentId: payment.razorpayPaymentId,
            type: "credit",
            amount: payment.workerPayout,
            currency: payment.currency,
            status: "completed",
            description: `Payout for completed work ${payment.workId}`,
            metadata: {
                platformFee: payment.platformFee,
                totalAmount: payment.amount,
            },
        });

        // Platform fee audit record (hidden from worker UI)
        await this.txRepo.create({
            walletId: workerWallet.id,
            workId: payment.workId,
            type: "platform_fee",
            amount: payment.platformFee,
            currency: payment.currency,
            status: "completed",
            description: `1% platform fee for work ${payment.workId}`,
        });

        // Record platform earning
        await this.platformEarningRepo.create({
            paymentId: payment.id,
            workId: payment.workId,
            feeAmount: payment.platformFee,
            currency: payment.currency,
        });

        await this.paymentRepo.updateStatus(payment.id, "worker_credited", {
            payoutCompletedAt: new Date(),
        });

        // so it shows correctly in the worker wallet UI
        try {
            const holdTxs = await this.txRepo.findByWorkId(payment.workId);
            const holdTx = holdTxs.find(tx => tx.type === "hold" && tx.status === "pending");
            if (holdTx) {
                await this.txRepo.updateStatus(holdTx.id, "completed");
            }
        } catch (err) {
            // Non-critical: log but don't fail the payout
            console.error("[ReleaseWorkerPayout] Could not update hold tx status:", err);
        }

        console.log(`[ReleaseWorkerPayout] Released ₹${payment.workerPayout} to worker ${payment.workerId}`);
    }
}