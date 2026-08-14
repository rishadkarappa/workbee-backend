// import { injectable } from "tsyringe";
// import { getPool } from "../../config/connectDB";
// import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
// import { Payment } from "../../../domain/entities/Payment";
// import { PaymentRow } from "../row/PaymentRow";

// @injectable()
// export class PaymentRepository implements IPaymentRepository {
//     private get db() {
//         return getPool();
//     }

//     private mapPayment(row: PaymentRow): Payment {
//         return {
//             id: row.id,
//             workId: row.work_id,
//             userId: row.user_id,
//             workerId: row.worker_id,

//             razorpayOrderId: row.razorpay_order_id ?? undefined,
//             razorpayPaymentId: row.razorpay_payment_id ?? undefined,

//             amount: Number(row.amount),
//             platformFee: Number(row.platform_fee),
//             workerPayout: Number(row.worker_payout),

//             currency: row.currency,
//             status: row.status,

//             workCompletedAt: row.work_completed_at ?? undefined,
//             payoutScheduledAt: row.payout_scheduled_at ?? undefined,
//             payoutCompletedAt: row.payout_completed_at ?? undefined,

//             createdAt: row.created_at,
//             updatedAt: row.updated_at,
//         };
//     }

//     async create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
//         const { rows } = await this.db.query(
//             `INSERT INTO payments
//                (work_id, user_id, worker_id, razorpay_order_id, razorpay_payment_id,
//                 amount, platform_fee, worker_payout, currency, status)
//              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
//              RETURNING *`,
//             [
//                 data.workId,
//                 data.userId,
//                 data.workerId,
//                 data.razorpayOrderId ?? null,
//                 data.razorpayPaymentId ?? null,
//                 data.amount,
//                 data.platformFee,
//                 data.workerPayout,
//                 data.currency,
//                 data.status,
//             ]
//         );
//         return this.mapPayment(rows[0]);
//     }

//     async findById(id: string): Promise<Payment | null> {
//         const { rows } = await this.db.query(
//             "SELECT * FROM payments WHERE id = $1",
//             [id]
//         );
//         return rows[0] ? this.mapPayment(rows[0]) : null;
//     }

//     async findByWorkId(workId: string): Promise<Payment | null> {
//         const { rows } = await this.db.query(
//             "SELECT * FROM payments WHERE work_id = $1 ORDER BY created_at DESC LIMIT 1",
//             [workId]
//         );
//         return rows[0] ? this.mapPayment(rows[0]) : null;
//     }

//     // Called with razorpay order_id 
//     async findByRazorpayOrderId(orderId: string): Promise<Payment | null> {
//         const { rows } = await this.db.query(
//             "SELECT * FROM payments WHERE razorpay_order_id = $1",
//             [orderId]
//         );
//         return rows[0] ? this.mapPayment(rows[0]) : null;
//     }

//     // Called with razorpay payment_id
//     async findByRazorpayPaymentId(paymentId: string): Promise<Payment | null> {
//         const { rows } = await this.db.query(
//             "SELECT * FROM payments WHERE razorpay_payment_id = $1",
//             [paymentId]
//         );
//         return rows[0] ? this.mapPayment(rows[0]) : null;
//     }

//     async findAllPaginated(page: number, limit: number):
//         Promise<{ payments: Payment[]; total: number; totalPages: number; }> {
//         const offset = (page - 1) * limit;

//         const { rows } = await this.db.query(
//             `SELECT * FROM payments
//      ORDER BY created_at DESC
//      LIMIT $1 OFFSET $2`,
//             [limit, offset]
//         );

//         const { rows: countRows } = await this.db.query(
//             "SELECT COUNT(*) AS total FROM payments"
//         );

//         const total = parseInt(countRows[0].total);

//         return {
//             payments: rows.map(this.mapPayment.bind(this)),
//             total,
//             totalPages: Math.ceil(total / limit),
//         };
//     }

//     async updateStatus(id: string, status: string, extra: Partial<Payment> = {}): Promise<Payment> {
//         const setClauses: string[] = ["status = $2", "updated_at = NOW()"];
//         const values: (string | number | Date | null)[] = [id, status];
//         let idx = 3;

//         if (extra.razorpayPaymentId) {
//             setClauses.push(`razorpay_payment_id = $${idx++}`);
//             values.push(extra.razorpayPaymentId);
//         }
//         if (extra.razorpayOrderId) {
//             setClauses.push(`razorpay_order_id = $${idx++}`);
//             values.push(extra.razorpayOrderId);
//         }
//         if (extra.workCompletedAt) {
//             setClauses.push(`work_completed_at = $${idx++}`);
//             values.push(extra.workCompletedAt);
//         }
//         if (extra.payoutScheduledAt) {
//             setClauses.push(`payout_scheduled_at = $${idx++}`);
//             values.push(extra.payoutScheduledAt);
//         }
//         if (extra.payoutCompletedAt) {
//             setClauses.push(`payout_completed_at = $${idx++}`);
//             values.push(extra.payoutCompletedAt);
//         }

//         const { rows } = await this.db.query(
//             `UPDATE payments SET ${setClauses.join(", ")} WHERE id = $1 RETURNING *`,
//             values
//         );
//         return this.mapPayment(rows[0]);
//     }
// }

// infra/database/repos/PaymentRepository.ts
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