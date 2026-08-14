// import { injectable } from "tsyringe";
// import { getPool } from "../../config/connectDB";
// import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
// import { Transaction, TransactionStatus, TransactionType } from "../../../domain/entities/Transaction";
// import { TransactionRow } from "../row/TransactionRow";

// @injectable()
// export class TransactionRepository implements ITransactionRepository {
//     private get db() {
//         return getPool();
//     }

//     private mapTx(row: TransactionRow): Transaction {
//         return {
//             id: row.id,
//             walletId: row.wallet_id,
//             workId: row.work_id ?? undefined,
//             razorpayPaymentId: row.razorpay_payment_id ?? undefined,

//             type: row.type as TransactionType,
//             amount: Number(row.amount),
//             currency: row.currency,
//             status: row.status as TransactionStatus,

//             description: row.description ?? undefined,
//             metadata: row.metadata ?? undefined,

//             createdAt: row.created_at,
//         };
//     }

//     async create(data: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
//         const { rows } = await this.db.query(
//             `INSERT INTO transactions
//                (wallet_id, work_id, razorpay_payment_id, type, amount,
//                 currency, status, description, metadata)
//              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
//              RETURNING *`,
//             [
//                 data.walletId,
//                 data.workId ?? null,
//                 data.razorpayPaymentId ?? null,
//                 data.type,
//                 data.amount,
//                 data.currency,
//                 data.status,
//                 data.description ?? null,
//                 data.metadata ? JSON.stringify(data.metadata) : null,
//             ]
//         );
//         return this.mapTx(rows[0]);
//     }

//     // Update transaction status (e.g., hold → completed after payout)
//     async updateStatus(id: string, status: string): Promise<Transaction> {
//         const { rows } = await this.db.query(
//             `UPDATE transactions SET status = $2 WHERE id = $1 RETURNING *`,
//             [id, status]
//         );
//         return this.mapTx(rows[0]);
//     }

//     async findByWalletId(walletId: string, limit = 50): Promise<Transaction[]> {
//         const { rows } = await this.db.query(
//             "SELECT * FROM transactions WHERE wallet_id = $1 ORDER BY created_at DESC LIMIT $2",
//             [walletId, limit]
//         );
//         return rows.map(this.mapTx.bind(this));
//     }

//     async findByWorkId(workId: string): Promise<Transaction[]> {
//         const { rows } = await this.db.query(
//             "SELECT * FROM transactions WHERE work_id = $1 ORDER BY created_at DESC",
//             [workId]
//         );
//         return rows.map(this.mapTx.bind(this));
//     }
// }

// infra/database/repos/TransactionRepository.ts

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