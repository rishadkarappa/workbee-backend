// import { injectable } from "tsyringe";
// import { getPool } from "../../config/connectDB";
// import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
// import { Wallet } from "../../../domain/entities/Wallet";
// import { WalletRow } from "../row/WalletRow";

// @injectable()
// export class WalletRepository implements IWalletRepository {
//   private get db() {
//     return getPool();
//   }

//   private mapWallet(row: WalletRow): Wallet {
//     return {
//       id: row.id,
//       ownerId: row.owner_id,
//       role: row.role,
//       balance: Number(row.balance),
//       pendingBalance: Number(row.pending_balance),
//       totalEarned: Number(row.total_earned),
//       totalSpent: Number(row.total_spent),
//       createdAt: row.created_at,
//       updatedAt: row.updated_at,
//     };
//   }

//   async findByOwner(ownerId: string, role: string): Promise<Wallet | null> {
//     const { rows } = await this.db.query(
//       "SELECT * FROM wallets WHERE owner_id = $1 AND role = $2",
//       [ownerId, role]
//     );
//     return rows[0] ? this.mapWallet(rows[0]) : null;
//   }

//   async findOrCreate(ownerId: string, role: string): Promise<Wallet> {
//     const existing = await this.findByOwner(ownerId, role);
//     if (existing) return existing;

//     const { rows } = await this.db.query(
//       `INSERT INTO wallets (owner_id, role)
//        VALUES ($1, $2)
//        ON CONFLICT (owner_id, role) DO UPDATE SET updated_at = NOW()
//        RETURNING *`,
//       [ownerId, role]
//     );
//     return this.mapWallet(rows[0]);
//   }

//   async updateBalance(walletId: string, delta: number): Promise<Wallet> {
//     const { rows } = await this.db.query(
//       `UPDATE wallets SET balance = balance + $1, updated_at = NOW()
//        WHERE id = $2 RETURNING *`,
//       [delta, walletId]
//     );
//     return this.mapWallet(rows[0]);
//   }

//   async updatePendingBalance(walletId: string, delta: number): Promise<Wallet> {
//     const { rows } = await this.db.query(
//       `UPDATE wallets SET pending_balance = pending_balance + $1, updated_at = NOW()
//        WHERE id = $2 RETURNING *`,
//       [delta, walletId]
//     );
//     return this.mapWallet(rows[0]);
//   }

//   async movePendingToBalance(walletId: string, amount: number): Promise<Wallet> {
//     const { rows } = await this.db.query(
//       `UPDATE wallets
//        SET pending_balance = pending_balance - $1,
//            balance         = balance         + $1,
//            updated_at      = NOW()
//        WHERE id = $2 RETURNING *`,
//       [amount, walletId]
//     );
//     return this.mapWallet(rows[0]);
//   }

//   async incrementTotalEarned(walletId: string, amount: number): Promise<void> {
//     await this.db.query(
//       "UPDATE wallets SET total_earned = total_earned + $1, updated_at = NOW() WHERE id = $2",
//       [amount, walletId]
//     );
//   }

//   async incrementTotalSpent(walletId: string, amount: number): Promise<void> {
//     await this.db.query(
//       "UPDATE wallets SET total_spent = total_spent + $1, updated_at = NOW() WHERE id = $2",
//       [amount, walletId]
//     );
//   }
// }

// infra/database/repos/WalletRepository.ts

import { injectable } from "tsyringe";
import { getPrisma } from "../../config/prisma";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { Wallet } from "../../../domain/entities/Wallet";

@injectable()
export class WalletRepository implements IWalletRepository {
  private get db() {
    return getPrisma();
  }

  private mapWallet(row: any): Wallet {
    return {
      id: row.id,
      ownerId: row.ownerId,
      role: row.role,
      balance: Number(row.balance),
      pendingBalance: Number(row.pendingBalance),
      totalEarned: Number(row.totalEarned),
      totalSpent: Number(row.totalSpent),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async findByOwner(ownerId: string, role: string): Promise<Wallet | null> {
    const row = await this.db.wallet.findUnique({
      where: { ownerId_role: { ownerId, role: role as any } },
    });
    return row ? this.mapWallet(row) : null;
  }

  async findOrCreate(ownerId: string, role: string): Promise<Wallet> {
    const row = await this.db.wallet.upsert({
      where: { ownerId_role: { ownerId, role: role as any } },
      update: {},
      create: { ownerId, role: role as any },
    });
    return this.mapWallet(row);
  }

  async updateBalance(walletId: string, delta: number): Promise<Wallet> {
    const row = await this.db.wallet.update({
      where: { id: walletId },
      data: { balance: { increment: delta } },
    });
    return this.mapWallet(row);
  }

  async updatePendingBalance(walletId: string, delta: number): Promise<Wallet> {
    const row = await this.db.wallet.update({
      where: { id: walletId },
      data: { pendingBalance: { increment: delta } },
    });
    return this.mapWallet(row);
  }

  async movePendingToBalance(walletId: string, amount: number): Promise<Wallet> {
    const row = await this.db.wallet.update({
      where: { id: walletId },
      data: {
        pendingBalance: { decrement: amount },
        balance: { increment: amount },
      },
    });
    return this.mapWallet(row);
  }

  async incrementTotalEarned(walletId: string, amount: number): Promise<void> {
    await this.db.wallet.update({
      where: { id: walletId },
      data: { totalEarned: { increment: amount } },
    });
  }

  async incrementTotalSpent(walletId: string, amount: number): Promise<void> {
    await this.db.wallet.update({
      where: { id: walletId },
      data: { totalSpent: { increment: amount } },
    });
  }
}