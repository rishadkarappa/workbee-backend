export interface IGetAdminPaymentSummaryUseCase {
    execute(): Promise<{
        totalRevenue: number; totalPlatformFees: number; pendingPayouts: number; refundedAmount: number;
    }>;
}