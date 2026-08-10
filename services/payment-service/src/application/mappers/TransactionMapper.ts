import { Transaction } from "../../domain/entities/Transaction";
import { TransactionDTO } from "../dtos/wallet/TransactionDTO";

export class TransactionMapper {
  static toDTO(tx: Transaction): TransactionDTO {
    return {
      id: tx.id,
      workId: tx.workId,
      type: tx.type,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      description: tx.description,
      createdAt: tx.createdAt,
    };
  }

  // Worker/user-facing list: strips internal audit rows (platform_fee)
  // that exist in the DB for admin reporting but should never surface
  // in a non-admin wallet view. Admin gets the unfiltered list.

  static toRoleFilteredList(transactions: Transaction[], role: string): TransactionDTO[] {
    const visible = role === "admin"
      ? transactions
      : transactions.filter(tx => tx.type !== "platform_fee");

    return visible.map(this.toDTO);
  }
}