import { injectable } from "tsyringe";
import { getPool } from "../../config/connectDB";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { Wallet } from "../../../domain/entities/Wallet";

// ── Wallet Repository ─────────────────────────────────────────
@injectable()
export class WalletRepository implements IWalletRepository {
  private get db() { return getPool(); }

  private mapWallet(row: any): Wallet {
    return {
      id: row.id,
      ownerId: row.owner_id,
      role: row.role,
      balance: parseFloat(row.balance),
      pendingBalance: parseFloat(row.pending_balance),
      totalEarned: parseFloat(row.total_earned),
      totalSpent: parseFloat(row.total_spent),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findByOwner(ownerId: string, role: string): Promise<Wallet | null> {
    const { rows } = await this.db.query(
      "SELECT * FROM wallets WHERE owner_id = $1 AND role = $2",
      [ownerId, role]
    );
    return rows[0] ? this.mapWallet(rows[0]) : null;
  }

  async findOrCreate(ownerId: string, role: string): Promise<Wallet> {
    const existing = await this.findByOwner(ownerId, role);
    if (existing) return existing;

    const { rows } = await this.db.query(
      `INSERT INTO wallets (owner_id, role)
       VALUES ($1, $2)
       ON CONFLICT (owner_id, role) DO UPDATE SET updated_at = NOW()
       RETURNING *`,
      [ownerId, role]
    );
    return this.mapWallet(rows[0]);
  }

  async updateBalance(walletId: string, delta: number): Promise<Wallet> {
    const { rows } = await this.db.query(
      `UPDATE wallets SET balance = balance + $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [delta, walletId]
    );
    return this.mapWallet(rows[0]);
  }

  async updatePendingBalance(walletId: string, delta: number): Promise<Wallet> {
    const { rows } = await this.db.query(
      `UPDATE wallets SET pending_balance = pending_balance + $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [delta, walletId]
    );
    return this.mapWallet(rows[0]);
  }

  async movePendingToBalance(walletId: string, amount: number): Promise<Wallet> {
    const { rows } = await this.db.query(
      `UPDATE wallets
       SET pending_balance = pending_balance - $1,
           balance         = balance         + $1,
           updated_at      = NOW()
       WHERE id = $2 RETURNING *`,
      [amount, walletId]
    );
    return this.mapWallet(rows[0]);
  }

  async incrementTotalEarned(walletId: string, amount: number): Promise<void> {
    await this.db.query(
      "UPDATE wallets SET total_earned = total_earned + $1, updated_at = NOW() WHERE id = $2",
      [amount, walletId]
    );
  }

  async incrementTotalSpent(walletId: string, amount: number): Promise<void> {
    await this.db.query(
      "UPDATE wallets SET total_spent = total_spent + $1, updated_at = NOW() WHERE id = $2",
      [amount, walletId]
    );
  }
}