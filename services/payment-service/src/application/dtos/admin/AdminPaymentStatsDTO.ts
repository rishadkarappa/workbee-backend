export interface MonthlyAmountDto {
    month: string;
    year: number;
    amount: number;
}

export interface AdminTransactionSummaryDto {
    id: string;
    workId: string;
    amount: number;
    status: string;
    createdAt: Date;
}

export interface AdminPendingPayoutDto {
    paymentId: string;
    workerId: string;
    workId: string;
    workerPayout: number;
    workCompletedAt?: Date;
}

export interface AdminPaymentStatsResponseDto {
    grossRevenue: number;
    platformEarnings: number;
    pendingPayoutsAmount: number;
    pendingPayoutsCount: number;
    completedTransactionsCount: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    platformEarningsThisMonth: number;
    platformEarningsLastMonth: number;
    monthlyPlatformEarnings: MonthlyAmountDto[];
    monthlyRevenue: MonthlyAmountDto[];
    recentTransactions: AdminTransactionSummaryDto[];
    pendingPayouts: AdminPendingPayoutDto[];
}