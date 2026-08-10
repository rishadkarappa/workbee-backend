import { inject, injectable } from "tsyringe";
import Razorpay from "razorpay";

import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { ICreateRazorpayOrderUseCase } from "../../ports/user/ICreateRazorpayOrderUseCase";
import { CreateOrderRequestDTO,CreateOrderResponseDTO } from "../../dtos/payment/CreateOrderDTO";

const PLATFORM_FEE_PERCENT = 0.01;

@injectable()
export class CreateRazorpayOrderUseCase implements ICreateRazorpayOrderUseCase {
  
  private razorpay: Razorpay;

  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async execute(data: CreateOrderRequestDTO): Promise<CreateOrderResponseDTO> {
    const currency = (data.currency || "INR").toUpperCase();
    const amountPaise = Math.round(data.amount * 100);
    const platformFee = parseFloat((data.amount * PLATFORM_FEE_PERCENT).toFixed(2));
    const workerPayout = parseFloat((data.amount - platformFee).toFixed(2));

    const order = await this.razorpay.orders.create({
      amount: amountPaise,
      currency,
      receipt: `work_${data.workId}`,
      notes: { workId: data.workId, userId: data.userId, workerId: data.workerId },
    });

    const payment = await this.paymentRepo.create({
      workId: data.workId,
      userId: data.userId,
      workerId: data.workerId,
      razorpayOrderId: order.id,
      amount: data.amount,
      platformFee,
      workerPayout,
      currency,
      status: "pending",
    });

    return {
      orderId: order.id,
      amount: amountPaise,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID!,
      paymentId: payment.id,
    };
  }
}