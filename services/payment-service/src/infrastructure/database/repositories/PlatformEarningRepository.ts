import { injectable } from "tsyringe";
import { getPrisma } from "../../config/prisma";
import {
  IPlatformEarningRepository,
} from "../../../domain/repositories/IPlatformEarningRepository";
import { PlatformEarning } from "../../../domain/entities/Platform";

@injectable()
export class PlatformEarningRepository implements IPlatformEarningRepository {
  private get db() {
    return getPrisma();
  }

  private mapEarning(row: any): PlatformEarning {
    return {
      id: row.id,
      paymentId: row.paymentId,
      workId: row.workId,
      feeAmount: Number(row.feeAmount),
      currency: row.currency,
      collectedAt: row.collectedAt,
    };
  }

  async create(data: Omit<PlatformEarning, "id" | "collectedAt">): Promise<PlatformEarning> {
    const row = await this.db.platformEarning.create({
      data: {
        paymentId: data.paymentId,
        workId: data.workId,
        feeAmount: data.feeAmount,
        currency: data.currency,
      },
    });
    return this.mapEarning(row);
  }

  async getAdminSummary(): Promise<{
    totalRevenue: number;
    totalPlatformFees: number;
    pendingPayouts: number;
    refundedAmount: number;
  }> {
    const [revenueAgg, paidPayoutAgg, refundedAgg] = await this.db.$transaction([
      this.db.payment.aggregate({
        where: { status: { in: ["paid", "worker_credited"] as any } },
        _sum: { amount: true, platformFee: true },
      }),
      this.db.payment.aggregate({
        where: { status: "paid" as any },
        _sum: { workerPayout: true },
      }),
      this.db.payment.aggregate({
        where: { status: "refunded" as any },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalRevenue: Number(revenueAgg._sum.amount ?? 0),
      totalPlatformFees: Number(revenueAgg._sum.platformFee ?? 0),
      pendingPayouts: Number(paidPayoutAgg._sum.workerPayout ?? 0),
      refundedAmount: Number(refundedAgg._sum.amount ?? 0),
    };
  }

  async findAll(limit = 50, offset = 0): Promise<PlatformEarning[]> {
    const rows = await this.db.platformEarning.findMany({
      orderBy: { collectedAt: "desc" },
      take: limit,
      skip: offset,
    });
    return rows.map((r) => this.mapEarning(r));
  }
}