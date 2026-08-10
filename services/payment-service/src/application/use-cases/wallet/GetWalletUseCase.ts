import { inject, injectable } from "tsyringe";

import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IGetWalletUseCase } from "../../ports/wallet/IGetWalletUseCase";
import { WalletResponseDTO } from "../../dtos/wallet/TransactionDTO";
import { WalletMapper } from "../../mappers/WalletMapper";

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(
    @inject("WalletRepository") private walletRepo: IWalletRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository
  ) {}

  async execute(ownerId: string, role: string): Promise<WalletResponseDTO> {
    const wallet = await this.walletRepo.findOrCreate(ownerId, role);
    const transactions = await this.txRepo.findByWalletId(wallet.id);
    return WalletMapper.toResponseDTO(wallet, transactions);
  }
}