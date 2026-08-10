export interface TransactionDTO {
  id: string;
  workId?: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  createdAt: Date;
}

export interface WalletResponseDTO {
  id: string;
  role: "user" | "worker" | "admin";
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: TransactionDTO[];
}