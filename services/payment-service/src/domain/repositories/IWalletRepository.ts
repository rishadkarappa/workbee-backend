import { Wallet } from "../entities/Wallet";
 
export interface IWalletRepository {
  findByOwner(ownerId: string, role: string): Promise<Wallet | null>;
  findOrCreate(ownerId: string, role: string): Promise<Wallet>;
  updateBalance(walletId: string, delta: number): Promise<Wallet>;
  updatePendingBalance(walletId: string, delta: number): Promise<Wallet>;
  movePendingToBalance(walletId: string, amount: number): Promise<Wallet>;
  incrementTotalEarned(walletId: string, amount: number): Promise<void>;
  incrementTotalSpent(walletId: string, amount: number): Promise<void>;
}