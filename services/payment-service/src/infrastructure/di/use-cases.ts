import 'reflect-metadata';
import { container } from 'tsyringe';

import { ScheduleWorkerPayoutUseCase } from '../../application/use-cases/worker/ScheduleWorkerPayoutUseCase';
import { ReleaseWorkerPayoutUseCase } from '../../application/use-cases/worker/ReleaseWorkerPayoutUseCase';
import { GetWalletUseCase } from '../../application/use-cases/wallet/GetWalletUseCase';
import { GetAdminPaymentSummaryUseCase } from '../../application/use-cases/admin/GetAdminPaymentSummaryUseCase';
import { CreateRazorpayOrderUseCase } from '../../application/use-cases/payment/CreateRazorpayOrderUseCase';
import { VerifyRazorpayPaymentUseCase } from '../../application/use-cases/payment/VerifyRazorpayPaymentUseCase';
import { GetAdminPaymentsListUseCase } from '../../application/use-cases/admin/GetAdminPaymentsListUseCase';

container.register("CreateRazorpayOrderUseCase", { useClass: CreateRazorpayOrderUseCase });
container.register("VerifyRazorpayPaymentUseCase", { useClass: VerifyRazorpayPaymentUseCase });
container.register("ScheduleWorkerPayoutUseCase", { useClass: ScheduleWorkerPayoutUseCase });
container.register("ReleaseWorkerPayoutUseCase", { useClass: ReleaseWorkerPayoutUseCase });
container.register("GetWalletUseCase", { useClass: GetWalletUseCase });
container.register("GetAdminPaymentSummaryUseCase", { useClass: GetAdminPaymentSummaryUseCase });
container.registerSingleton("GetAdminPaymentsListUseCase", GetAdminPaymentsListUseCase);

export { container };