import { injectable } from "tsyringe";
import { getPrisma } from "../../config/prisma";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { Payment } from "../../../domain/entities/Payment";
import { Prisma } from "../../../generated/prisma/client";

@injectable()
export class PaymentRepository implements IPaymentRepository {
  private get db() {
    return getPrisma();
  }

  private mapPayment(row: any): Payment {
    return {
      id: row.id,
      workId: row.workId,
      userId: row.userId,
      workerId: row.workerId,
      razorpayOrderId: row.razorpayOrderId ?? undefined,
      razorpayPaymentId: row.razorpayPaymentId ?? undefined,
      amount: Number(row.amount),
      platformFee: Number(row.platformFee),
      workerPayout: Number(row.workerPayout),
      currency: row.currency,
      status: row.status,
      workCompletedAt: row.workCompletedAt ?? undefined,
      payoutScheduledAt: row.payoutScheduledAt ?? undefined,
      payoutCompletedAt: row.payoutCompletedAt ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
    const row = await this.db.payment.create({
      data: {
        workId: data.workId,
        userId: data.userId,
        workerId: data.workerId,
        razorpayOrderId: data.razorpayOrderId ?? null,
        razorpayPaymentId: data.razorpayPaymentId ?? null,
        amount: data.amount,
        platformFee: data.platformFee,
        workerPayout: data.workerPayout,
        currency: data.currency,
        status: data.status as any,
      },
    });
    return this.mapPayment(row);
  }

  async findById(id: string): Promise<Payment | null> {
    const row = await this.db.payment.findUnique({ where: { id } });
    return row ? this.mapPayment(row) : null;
  }

  async findByWorkId(workId: string): Promise<Payment | null> {
    const row = await this.db.payment.findFirst({
      where: { workId },
      orderBy: { createdAt: "desc" },
    });
    return row ? this.mapPayment(row) : null;
  }

  async findByRazorpayOrderId(orderId: string): Promise<Payment | null> {
    const row = await this.db.payment.findUnique({ where: { razorpayOrderId: orderId } });
    return row ? this.mapPayment(row) : null;
  }

  async findByRazorpayPaymentId(paymentId: string): Promise<Payment | null> {
    const row = await this.db.payment.findUnique({ where: { razorpayPaymentId: paymentId } });
    return row ? this.mapPayment(row) : null;
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [rows, total] = await this.db.$transaction([
      this.db.payment.findMany({ orderBy: { createdAt: "desc" }, take: limit, skip }),
      this.db.payment.count(),
    ]);
    return {
      payments: rows.map((r) => this.mapPayment(r)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(id: string, status: string, extra: Partial<Payment> = {}): Promise<Payment> {
    const data: Prisma.PaymentUpdateInput = { status: status as any };
    if (extra.razorpayPaymentId) data.razorpayPaymentId = extra.razorpayPaymentId;
    if (extra.razorpayOrderId) data.razorpayOrderId = extra.razorpayOrderId;
    if (extra.workCompletedAt) data.workCompletedAt = extra.workCompletedAt;
    if (extra.payoutScheduledAt) data.payoutScheduledAt = extra.payoutScheduledAt;
    if (extra.payoutCompletedAt) data.payoutCompletedAt = extra.payoutCompletedAt;

    const row = await this.db.payment.update({ where: { id }, data });
    return this.mapPayment(row);
  }
}