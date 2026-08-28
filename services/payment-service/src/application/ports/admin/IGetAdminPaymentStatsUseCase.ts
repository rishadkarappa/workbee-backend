import { AdminPaymentStatsResponseDto } from "../../dtos/admin/AdminPaymentStatsDTO";

export interface IGetAdminPaymentStatsUseCase {
    execute(): Promise<AdminPaymentStatsResponseDto>;
}