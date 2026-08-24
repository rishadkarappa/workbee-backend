import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IGetWalletUseCase } from "../../ports/wallet/IGetWalletUseCase";
import { GetWalletRequestDTO,WalletResponseDTO } from "../../dtos/wallet/TransactionDTO";
import { WalletMapper } from "../../mappers/WalletMapper";

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(
    @inject("WalletRepository") private walletRepo: IWalletRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository
  ) {}

  // async execute(data: GetWalletRequestDTO): Promise<WalletResponseDTO> {
  //   const wallet = await this.walletRepo.findOrCreate(data.ownerId, data.role);
  //   const transactions = await this.txRepo.findByWalletId(wallet.id);
  //   return WalletMapper.toResponseDTO(wallet, transactions);
  // }
  async execute(data: GetWalletRequestDTO): Promise<WalletResponseDTO> {
  console.log("GET WALLET DATA:", data);

  const wallet = await this.walletRepo.findOrCreate(
    data.ownerId,
    data.role
  );

  console.log("WALLET FROM DB:", wallet);

  const transactions = await this.txRepo.findByWalletId(wallet.id);

  console.log("TRANSACTIONS:", transactions);

  return WalletMapper.toResponseDTO(wallet, transactions);
}
}