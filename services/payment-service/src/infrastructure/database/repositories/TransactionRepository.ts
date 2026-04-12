import { injectable } from "tsyringe";
import { getPool } from "../../config/connectDB";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { Transaction } from "../../../domain/entities/Transaction";

// ── Transaction Repository ────────────────────────────────────
@injectable()
export class TransactionRepository implements ITransactionRepository {
  private get db() { return getPool(); }

  private mapTx(row: any): Transaction {
    return {
      id:                    row.id,
      walletId:              row.wallet_id,
      workId:                row.work_id,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      type:                  row.type,
      amount:                parseFloat(row.amount),
      currency:              row.currency,
      status:                row.status,
      description:           row.description,
      metadata:              row.metadata,
      createdAt:             row.created_at,
    };
  }

  async create(data: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
    const { rows } = await this.db.query(
      `INSERT INTO transactions
         (wallet_id, work_id, stripe_payment_intent_id, type, amount, currency, status, description, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        data.walletId,
        data.workId ?? null,
        data.stripePaymentIntentId ?? null,
        data.type,
        data.amount,
        data.currency,
        data.status,
        data.description ?? null,
        data.metadata ? JSON.stringify(data.metadata) : null,
      ]
    );
    return this.mapTx(rows[0]);
  }

  async findByWalletId(walletId: string, limit = 50): Promise<Transaction[]> {
    const { rows } = await this.db.query(
      "SELECT * FROM transactions WHERE wallet_id = $1 ORDER BY created_at DESC LIMIT $2",
      [walletId, limit]
    );
    return rows.map(this.mapTx);
  }

  async findByWorkId(workId: string): Promise<Transaction[]> {
    const { rows } = await this.db.query(
      "SELECT * FROM transactions WHERE work_id = $1 ORDER BY created_at DESC",
      [workId]
    );
    return rows.map(this.mapTx);
  }
}