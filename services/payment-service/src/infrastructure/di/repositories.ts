import 'reflect-metadata';
import { container } from 'tsyringe';

// repository
import { WalletRepository } from '../database/repositories/WalletRepository';
import { TransactionRepository } from '../database/repositories/TransactionRepository';
import { PaymentRepository } from '../database/repositories/PaymentRepository';
import { PlatformEarningRepository } from '../database/repositories/PlatformEarningRepository';

// repo interfaces
import { IWalletRepository } from '../../domain/repositories/IWalletRepository';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { IPlatformEarningRepository } from '../../domain/repositories/IPlatformEarningRepository';

// di register
container.register<IWalletRepository>("WalletRepository", { useClass: WalletRepository });
container.register<ITransactionRepository>("TransactionRepository", { useClass: TransactionRepository });
container.register<IPaymentRepository>("PaymentRepository", { useClass: PaymentRepository });
container.register<IPlatformEarningRepository>("PlatformEarningRepository", { useClass: PlatformEarningRepository });

export { container };