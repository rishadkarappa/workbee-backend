import { PlatformEarning } from "../entities/Platform";


export interface IPlatformEarningRepository {
  create(data: Omit<PlatformEarning, "id" | "collectedAt">): Promise<PlatformEarning>;
  getAdminSummary(): Promise<{
    totalRevenue: number;
    totalPlatformFees: number;
    pendingPayouts: number;
    refundedAmount: number;
  }>;
  findAll(limit?: number, offset?: number): Promise<PlatformEarning[]>;
}
