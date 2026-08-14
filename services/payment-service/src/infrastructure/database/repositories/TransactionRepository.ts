import { injectable } from "tsyringe";
import { getPrisma } from "../../config/prisma";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { Transaction, TransactionStatus, TransactionType } from "../../../domain/entities/Transaction";

@injectable()
export class TransactionRepository implements ITransactionRepository {
  private get db() {
    return getPrisma();
  }

  private mapTx(row: any): Transaction {
    return {
      id: row.id,
      walletId: row.walletId,
      workId: row.workId ?? undefined,
      razorpayPaymentId: row.razorpayPaymentId ?? undefined,
      type: row.type as TransactionType,
      amount: Number(row.amount),
      currency: row.currency,
      status: row.status as TransactionStatus,
      description: row.description ?? undefined,
      metadata: row.metadata ?? undefined,
      createdAt: row.createdAt,
    };
  }

  async create(data: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
    const row = await this.db.transaction.create({
      data: {
        walletId: data.walletId,
        workId: data.workId ?? null,
        razorpayPaymentId: data.razorpayPaymentId ?? null,
        type: data.type as any,
        amount: data.amount,
        currency: data.currency,
        status: data.status as any,
        description: data.description ?? null,
        metadata: data.metadata ?? undefined,
      },
    });
    return this.mapTx(row);
  }

  async updateStatus(id: string, status: string): Promise<Transaction> {
    const row = await this.db.transaction.update({
      where: { id },
      data: { status: status as any },
    });
    return this.mapTx(row);
  }

  async findByWalletId(walletId: string, limit = 50): Promise<Transaction[]> {
    const rows = await this.db.transaction.findMany({
      where: { walletId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((r) => this.mapTx(r));
  }

  async findByWorkId(workId: string): Promise<Transaction[]> {
    const rows = await this.db.transaction.findMany({
      where: { workId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => this.mapTx(r));
  }
}