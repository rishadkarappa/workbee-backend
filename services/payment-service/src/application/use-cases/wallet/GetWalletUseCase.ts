import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IGetWalletUseCase } from "../../ports/wallet/IGetWalletUseCase";
import { GetWalletRequestDTO, WalletResponseDTO } from "../../dtos/wallet/TransactionDTO";
import { WalletMapper } from "../../mappers/WalletMapper";
import { TransactionMapper } from "../../mappers/TransactionMapper";

const DEFAULT_LIMIT = 5;

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(
    @inject("WalletRepository") private walletRepo: IWalletRepository,
    @inject("TransactionRepository") private txRepo: ITransactionRepository
  ) {}

  async execute(data: GetWalletRequestDTO): Promise<WalletResponseDTO> {
    const wallet = await this.walletRepo.findOrCreate(data.ownerId, data.role);

    const page = data.page && data.page > 0 ? data.page : 1;
    const limit = data.limit && data.limit > 0 ? data.limit : DEFAULT_LIMIT;

    const excludeTypes = TransactionMapper.getExcludedTypesForRole(data.role);

    const { transactions, total } = await this.txRepo.findByWalletId(wallet.id, {
      page,
      limit,
      status: data.status && data.status !== "all" ? data.status : undefined,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      excludeTypes,
    });

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return WalletMapper.toResponseDTO(wallet, transactions, pagination);
  }
}