import { GetWalletRequestDTO, WalletResponseDTO } from "../../dtos/wallet/TransactionDTO";

export interface IGetWalletUseCase {
  execute(data:GetWalletRequestDTO): Promise<WalletResponseDTO>;
}