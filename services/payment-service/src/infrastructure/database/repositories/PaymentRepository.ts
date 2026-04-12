import { injectable } from "tsyringe";
import { getPool } from "../../config/connectDB";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { Payment } from "../../../domain/entities/Payment";

@injectable()
export class PaymentRepository implements IPaymentRepository {
    private get db() { return getPool(); }

    private mapPayment(row: any): Payment {
        return {
            id:                 row.id,
            workId:             row.work_id,
            userId:             row.user_id,
            workerId:           row.worker_id,
            razorpayOrderId:    row.razorpay_order_id,    // renamed
            razorpayPaymentId:  row.razorpay_payment_id,  // renamed
            amount:             parseFloat(row.amount),
            platformFee:        parseFloat(row.platform_fee),
            workerPayout:       parseFloat(row.worker_payout),
            currency:           row.currency,
            status:             row.status,
            workCompletedAt:    row.work_completed_at,
            payoutScheduledAt:  row.payout_scheduled_at,
            payoutCompletedAt:  row.payout_completed_at,
            createdAt:          row.created_at,
            updatedAt:          row.updated_at,
        };
    }

    async create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
        const { rows } = await this.db.query(
            `INSERT INTO payments
               (work_id, user_id, worker_id, razorpay_order_id, razorpay_payment_id,
                amount, platform_fee, worker_payout, currency, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             RETURNING *`,
            [
                data.workId,
                data.userId,
                data.workerId,
                data.razorpayOrderId   ?? null,
                data.razorpayPaymentId ?? null,
                data.amount,
                data.platformFee,
                data.workerPayout,
                data.currency,
                data.status,
            ]
        );
        return this.mapPayment(rows[0]);
    }

    async findById(id: string): Promise<Payment | null> {
        const { rows } = await this.db.query(
            "SELECT * FROM payments WHERE id = $1",
            [id]
        );
        return rows[0] ? this.mapPayment(rows[0]) : null;
    }

    async findByWorkId(workId: string): Promise<Payment | null> {
        const { rows } = await this.db.query(
            "SELECT * FROM payments WHERE work_id = $1 ORDER BY created_at DESC LIMIT 1",
            [workId]
        );
        return rows[0] ? this.mapPayment(rows[0]) : null;
    }

    // Called with razorpay order_id 
    async findByRazorpayOrderId(orderId: string): Promise<Payment | null> {
        const { rows } = await this.db.query(
            "SELECT * FROM payments WHERE razorpay_order_id = $1",
            [orderId]
        );
        return rows[0] ? this.mapPayment(rows[0]) : null;
    }

    // Called with razorpay payment_id
    async findByRazorpayPaymentId(paymentId: string): Promise<Payment | null> {
        const { rows } = await this.db.query(
            "SELECT * FROM payments WHERE razorpay_payment_id = $1",
            [paymentId]
        );
        return rows[0] ? this.mapPayment(rows[0]) : null;
    }

    async updateStatus(id: string, status: string, extra: Partial<Payment> = {}): Promise<Payment> {
        const setClauses: string[] = ["status = $2", "updated_at = NOW()"];
        const values: any[]        = [id, status];
        let idx = 3;

        if (extra.razorpayPaymentId) {
            setClauses.push(`razorpay_payment_id = $${idx++}`);
            values.push(extra.razorpayPaymentId);
        }
        if (extra.razorpayOrderId) {
            setClauses.push(`razorpay_order_id = $${idx++}`);
            values.push(extra.razorpayOrderId);
        }
        if (extra.workCompletedAt) {
            setClauses.push(`work_completed_at = $${idx++}`);
            values.push(extra.workCompletedAt);
        }
        if (extra.payoutScheduledAt) {
            setClauses.push(`payout_scheduled_at = $${idx++}`);
            values.push(extra.payoutScheduledAt);
        }
        if (extra.payoutCompletedAt) {
            setClauses.push(`payout_completed_at = $${idx++}`);
            values.push(extra.payoutCompletedAt);
        }

        const { rows } = await this.db.query(
            `UPDATE payments SET ${setClauses.join(", ")} WHERE id = $1 RETURNING *`,
            values
        );
        return this.mapPayment(rows[0]);
    }
}