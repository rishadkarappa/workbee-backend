import { WalletResponseDTO } from "../../dtos/wallet/TransactionDTO";

export interface IGetWalletUseCase {
  execute(ownerId: string, role: string): Promise<WalletResponseDTO>;
}