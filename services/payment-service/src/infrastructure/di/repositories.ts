import 'reflect-metadata';
import { container } from 'tsyringe';
import { WalletRepository } from '../database/repositories/WalletRepository';
import { TransactionRepository } from '../database/repositories/TransactionRepository';
import { PaymentRepository } from '../database/repositories/PaymentRepository';
import { PlatformEarningRepository } from '../database/repositories/PlatformEarningRepository';

// ── DI Container registrations
container.register("WalletRepository", { useClass: WalletRepository });
container.register("TransactionRepository", { useClass: TransactionRepository });
container.register("PaymentRepository", { useClass: PaymentRepository });
container.register("PlatformEarningRepository", { useClass: PlatformEarningRepository });


export { container };