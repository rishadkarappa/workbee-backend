import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IGetWalletUseCase } from "../../ports/wallet/IGetWalletUseCase";
import { GetWalletRequestDTO, WalletResponseDTO } from "../../dtos/wallet/TransactionDTO";
import { WalletMapper } from "../../mappers/WalletMapper";

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(
    @inject("WalletRepository") private walletRepo: IWalletRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository
  ) { }


  async execute(data: GetWalletRequestDTO): Promise<WalletResponseDTO> {

    // console.log(data);

    const wallet = await this.walletRepo.findOrCreate(data.ownerId,data.role);

    // console.log(wallet);

    const transactions = await this.txRepo.findByWalletId(wallet.id);

    // console.log(transactions);

    return WalletMapper.toResponseDTO(wallet, transactions);
  }
}