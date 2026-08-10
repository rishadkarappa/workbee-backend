import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";

@injectable()
export class GetWalletUseCase {
  constructor(
    @inject("WalletRepository") private walletRepo: IWalletRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository
  ) { }

  async execute(ownerId: string, role: string) {
    const wallet = await this.walletRepo.findOrCreate(ownerId, role);
    const transactions = await this.txRepo.findByWalletId(wallet.id);
    return { wallet, transactions };
  }
}
