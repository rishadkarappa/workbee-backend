
import { injectable } from "tsyringe";
import { getPool } from "../../config/connectDB";
import {
  IPlatformEarningRepository,
} from "../../../domain/repositories/IPlatformEarningRepository";
import { PlatformEarning } from "../../../domain/entities/Platform";

// Platform Earning Repository

@injectable()
export class PlatformEarningRepository implements IPlatformEarningRepository {
  private get db() { return getPool(); }

  private mapEarning(row: any): PlatformEarning {
    return {
      id: row.id,
      paymentId: row.payment_id,
      workId: row.work_id,
      feeAmount: parseFloat(row.fee_amount),
      currency: row.currency,
      collectedAt: row.collected_at,
    };
  }

  async create(data: Omit<PlatformEarning, "id" | "collectedAt">): Promise<PlatformEarning> {
    const { rows } = await this.db.query(
      `INSERT INTO platform_earnings (payment_id, work_id, fee_amount, currency)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.paymentId, data.workId, data.feeAmount, data.currency]
    );
    return this.mapEarning(rows[0]);
  }

  async getAdminSummary(): Promise<{
    totalRevenue: number;
    totalPlatformFees: number;
    pendingPayouts: number;
    refundedAmount: number;
  }> {
    const { rows } = await this.db.query(`
      SELECT
        COALESCE(SUM(CASE WHEN p.status IN ('paid','worker_credited') THEN p.amount       ELSE 0 END), 0) AS total_revenue,
        COALESCE(SUM(CASE WHEN p.status IN ('paid','worker_credited') THEN p.platform_fee ELSE 0 END), 0) AS total_platform_fees,
        COALESCE(SUM(CASE WHEN p.status = 'paid'     THEN p.worker_payout ELSE 0 END), 0) AS pending_payouts,
        COALESCE(SUM(CASE WHEN p.status = 'refunded' THEN p.amount        ELSE 0 END), 0) AS refunded_amount
      FROM payments p
    `);
    const r = rows[0];
    return {
      totalRevenue: parseFloat(r.total_revenue),
      totalPlatformFees: parseFloat(r.total_platform_fees),
      pendingPayouts: parseFloat(r.pending_payouts),
      refundedAmount: parseFloat(r.refunded_amount),
    };
  }

  async findAll(limit = 50, offset = 0): Promise<PlatformEarning[]> {
    const { rows } = await this.db.query(
      "SELECT * FROM platform_earnings ORDER BY collected_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    return rows.map(this.mapEarning.bind(this));
  }
}