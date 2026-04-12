import { inject, injectable } from "tsyringe";
import Stripe from "stripe";
import {
  IWalletRepository
} from "../../domain/repositories/IWalletRepository";

import {
  IPaymentRepository,
} from "../../domain/repositories/IPaymentRepository";
 
const PLATFORM_FEE_PERCENT = 0.01; // 1%
 
// ────────────────────────────────────────────────────────────────
// CreateCheckoutSessionUseCase
// Called when user clicks "Confirm" on a deal request.
// Creates a Stripe Checkout session and a pending Payment row.
// ────────────────────────────────────────────────────────────────
@injectable()
export class CreateCheckoutSessionUseCase {
  private stripe: Stripe;
 
  constructor(
    @inject("PaymentRepository")        private paymentRepo:    IPaymentRepository,
    @inject("WalletRepository")         private walletRepo:     IWalletRepository
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    });
  }
 
  async execute(data: {
    workId:    string;
    userId:    string;
    workerId:  string;
    workTitle: string;
    amount:    number; // in INR (whole rupees)
    currency?: string;
  }) {
    const currency       = (data.currency || "inr").toLowerCase();
    const amountPaise    = Math.round(data.amount * 100);     // Stripe uses smallest unit
    const platformFee    = parseFloat((data.amount * PLATFORM_FEE_PERCENT).toFixed(2));
    const workerPayout   = parseFloat((data.amount - platformFee).toFixed(2));
 
    const successUrl = `${process.env.FRONTEND_URL}/user/user-dashboard/payment-success?workId=${data.workId}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl  = `${process.env.FRONTEND_URL}/user/user-dashboard/messages`;
 
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: data.workTitle },
            unit_amount:  amountPaise,
          },
          quantity: 1,
        },
      ],
      mode:        "payment",
      success_url: successUrl,
      cancel_url:  cancelUrl,
      metadata: {
        workId:   data.workId,
        userId:   data.userId,
        workerId: data.workerId,
      },
    });
 
    // Persist payment record
    const payment = await this.paymentRepo.create({
      workId:          data.workId,
      userId:          data.userId,
      workerId:        data.workerId,
      stripeSessionId: session.id,
      amount:          data.amount,
      platformFee,
      workerPayout,
      currency:        currency.toUpperCase(),
      status:          "pending",
    });
 
    return { sessionId: session.id, sessionUrl: session.url, payment };
  }
}
 