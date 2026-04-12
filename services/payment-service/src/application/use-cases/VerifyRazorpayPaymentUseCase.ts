import crypto from "crypto";
import { inject, injectable } from "tsyringe";

import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";

@injectable()
export class VerifyRazorpayPaymentUseCase {
  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository,
    @inject("WalletRepository") private walletRepo: IWalletRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository
  ) { }

  async execute(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{ success: boolean; paymentId: string }> {

    // 1. Verify HMAC signature
    const body = `${data.razorpayOrderId}|${data.razorpayPaymentId}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== data.razorpaySignature) {
      throw new Error("Payment signature verification failed");
    }

    // 2. Find payment by razorpay order id
    const payment = await this.paymentRepo.findByRazorpayOrderId(data.razorpayOrderId);
    if (!payment) throw new Error("Payment record not found");
    if (payment.status !== "pending") {
      return { success: true, paymentId: payment.id };
    }

    // 3. Mark as paid, store razorpay payment id
    await this.paymentRepo.updateStatus(payment.id, "paid", {
      razorpayPaymentId: data.razorpayPaymentId,
    });

    // 4. User wallet — record spend history
    const userWallet = await this.walletRepo.findOrCreate(payment.userId, "user");
    await this.txRepo.create({
      walletId: userWallet.id,
      workId: payment.workId,
      razorpayPaymentId: data.razorpayPaymentId,
      type: "payment",
      amount: payment.amount,
      currency: payment.currency,
      status: "completed",
      description: `Payment for work ${payment.workId}`,
      metadata: {
        workId: payment.workId,
        workerId: payment.workerId,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
      },
    });
    await this.walletRepo.incrementTotalSpent(userWallet.id, payment.amount);

    // 5. Worker wallet — hold pending payout
    const workerWallet = await this.walletRepo.findOrCreate(payment.workerId, "worker");
    await this.walletRepo.updatePendingBalance(workerWallet.id, payment.workerPayout);
    await this.txRepo.create({
      walletId: workerWallet.id,
      workId: payment.workId,
      razorpayPaymentId: data.razorpayPaymentId,
      type: "hold",
      amount: payment.workerPayout,
      currency: payment.currency,
      status: "pending",
      description: `Pending payout for work ${payment.workId} (releases after completion)`,
    });

    return { success: true, paymentId: payment.id };
  }
}


