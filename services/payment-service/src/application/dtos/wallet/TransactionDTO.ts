import { UserRole } from "workbee-common";

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

export interface GetWalletRequestDTO {
  ownerId: string;
  role: string;
}

export interface WalletResponseDTO {
  id: string;
  role: UserRole
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: TransactionDTO[];
}