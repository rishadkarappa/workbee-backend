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
  page?: number;
  limit?: number;
  status?: string; 
  startDate?: string; 
  endDate?: string;
}

export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WalletResponseDTO {
  id: string;
  role: UserRole;
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: TransactionDTO[];
  pagination: PaginationDTO;
}