

import { inject, injectable } from "tsyringe";
import Stripe from "stripe";
import {
  IPaymentRepository,
} from "../../domain/repositories/IPaymentRepository";


@injectable()
export class ScheduleWorkerPayoutUseCase {
  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository
  ) {}
 
  async execute(workId: string): Promise<{ paymentId: string; workerPayout: number } | null> {
    const payment = await this.paymentRepo.findByWorkId(workId);
 
    if (!payment || payment.status !== "paid") {
      // No payment found or already processed — not an error, work might be free
      return null;
    }
 
    await this.paymentRepo.updateStatus(payment.id, "paid", {
      workCompletedAt:   new Date(),
      payoutScheduledAt: new Date(),
    });
 
    return {
      paymentId:   payment.id,
      workerPayout: payment.workerPayout,
    };
  }
}
 