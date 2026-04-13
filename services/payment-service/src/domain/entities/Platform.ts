export interface PlatformEarning {
  id: string;
  paymentId: string;
  workId: string;
  feeAmount: number;
  currency: string;
  collectedAt: Date;
}