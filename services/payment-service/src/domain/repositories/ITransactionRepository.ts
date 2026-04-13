import { Transaction} from "../entities/Transaction";

export interface ITransactionRepository {
  create(data: Omit<Transaction, "id" | "createdAt">): Promise<Transaction>;
  findByWalletId(walletId: string, limit?: number): Promise<Transaction[]>;
  findByWorkId(workId: string): Promise<Transaction[]>;
  updateStatus(id: string, status: string): Promise<Transaction>;
}