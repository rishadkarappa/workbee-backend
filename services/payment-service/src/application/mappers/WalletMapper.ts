import { Wallet } from "../../domain/entities/Wallet";
import { Transaction } from "../../domain/entities/Transaction";
import { WalletResponseDTO } from "../dtos/wallet/TransactionDTO";
import { TransactionMapper } from "./TransactionMapper";

export class WalletMapper {
  static toResponseDTO(wallet: Wallet, transactions: Transaction[]): WalletResponseDTO {
    return {
      id: wallet.id,
      role: wallet.role,
      balance: wallet.balance,
      pendingBalance: wallet.pendingBalance,
      totalEarned: wallet.totalEarned,
      totalSpent: wallet.totalSpent,
      transactions: TransactionMapper.toRoleFilteredList(transactions, wallet.role),
    };
  }
}