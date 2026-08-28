export interface MonthlyEarningDto {
    month: string;
    year: number;
    amount: number;
}

export interface WorkerEarningsStatsResponseDto {
    totalEarnings: number;
    withdrawableBalance: number;
    pendingBalance: number;
    earningsThisMonth: number;
    earningsLastMonth: number;
    monthlyEarnings: MonthlyEarningDto[];
}