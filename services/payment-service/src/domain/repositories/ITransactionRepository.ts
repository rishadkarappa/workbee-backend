import { Transaction} from "../entities/Transaction";

export interface TransactionQueryOptions {
  page: number;
  limit: number;
  status?: string;     
  startDate?: Date;
  endDate?: Date;
  excludeTypes?: string[]; 
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
}

export interface ITransactionRepository {
  create(data: Omit<Transaction, "id" | "createdAt">): Promise<Transaction>;
  updateStatus(id: string, status: string): Promise<Transaction>;
  findByWalletId(walletId: string, options: TransactionQueryOptions): Promise<PaginatedTransactions>;
  findByWorkId(workId: string): Promise<Transaction[]>;
  getMonthlyEarnings(walletId: string, months: number): Promise<{ month: number; year: number; amount: number }[]>;
}