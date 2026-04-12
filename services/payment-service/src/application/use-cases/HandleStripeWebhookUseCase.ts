
import { inject, injectable } from "tsyringe";
import Stripe from "stripe";
import {
  IPaymentRepository,
} from "../../domain/repositories/IPaymentRepository";
import {
  IWalletRepository,
} from "../../domain/repositories/IWalletRepository";
 
import {
  ITransactionRepository,
} from "../../domain/repositories/ITransactionRepository";

@injectable()
export class HandleStripeWebhookUseCase {
  private stripe: Stripe;
 
  constructor(
    @inject("PaymentRepository")     private paymentRepo:    IPaymentRepository,
    @inject("WalletRepository")      private walletRepo:     IWalletRepository,
    @inject("TransactionRepository") private txRepo:         ITransactionRepository
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    });
  }
 
  async execute(rawBody: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;
 
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      throw new Error(`Webhook signature invalid: ${err.message}`);
    }
 
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await this._handleCheckoutComplete(session);
    }
  }
 
  private async _handleCheckoutComplete(session: Stripe.Checkout.Session) {
    if (session.payment_status !== "paid") return;
 
    const payment = await this.paymentRepo.findByStripeSession(session.id);
    if (!payment || payment.status !== "pending") return;
 
    // Mark payment as paid
    await this.paymentRepo.updateStatus(payment.id, "paid", {
      stripePaymentIntentId: session.payment_intent as string,
    });
 
    // Record spend on user wallet (debit history, balance unchanged — user paid via card)
    const userWallet = await this.walletRepo.findOrCreate(payment.userId, "user");
    await this.txRepo.create({
      walletId:              userWallet.id,
      workId:                payment.workId,
      stripePaymentIntentId: session.payment_intent as string,
      type:                  "payment",
      amount:                payment.amount,
      currency:              payment.currency,
      status:                "completed",
      description:           `Payment for work ${payment.workId}`,
      metadata: {
        workId:   payment.workId,
        workerId: payment.workerId,
      },
    });
    await this.walletRepo.incrementTotalSpent(userWallet.id, payment.amount);
 
    // Credit worker's pending wallet (held until 1hr after completion)
    const workerWallet = await this.walletRepo.findOrCreate(payment.workerId, "worker");
    await this.walletRepo.updatePendingBalance(workerWallet.id, payment.workerPayout);
    await this.txRepo.create({
      walletId:              workerWallet.id,
      workId:                payment.workId,
      stripePaymentIntentId: session.payment_intent as string,
      type:                  "hold",
      amount:                payment.workerPayout,
      currency:              payment.currency,
      status:                "pending",
      description:           `Pending payout for work ${payment.workId} (releases after completion)`,
    });
  }
}
 