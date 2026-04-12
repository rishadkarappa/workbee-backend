import 'reflect-metadata';
import { container } from 'tsyringe';
import { CreateCheckoutSessionUseCase } from '../../application/use-cases/CreateCheckoutSessionUseCase';
import { HandleStripeWebhookUseCase } from '../../application/use-cases/HandleStripeWebhookUseCase';
import { ScheduleWorkerPayoutUseCase } from '../../application/use-cases/ScheduleWorkerPayoutUseCase';
import { ReleaseWorkerPayoutUseCase } from '../../application/use-cases/ReleaseWorkerPayoutUseCase';
import { GetWalletUseCase } from '../../application/use-cases/GetWalletUseCase';
import { GetAdminPaymentSummaryUseCase } from '../../application/use-cases/GetAdminPaymentSummaryUseCase';


container.register("CreateCheckoutSessionUseCase",    { useClass: CreateCheckoutSessionUseCase });
container.register("HandleStripeWebhookUseCase",      { useClass: HandleStripeWebhookUseCase });
container.register("ScheduleWorkerPayoutUseCase",     { useClass: ScheduleWorkerPayoutUseCase });
container.register("ReleaseWorkerPayoutUseCase",      { useClass: ReleaseWorkerPayoutUseCase });
container.register("GetWalletUseCase",                { useClass: GetWalletUseCase });
container.register("GetAdminPaymentSummaryUseCase",   { useClass: GetAdminPaymentSummaryUseCase });

export { container };