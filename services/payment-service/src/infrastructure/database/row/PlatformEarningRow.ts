export interface PlatformEarningRow {
  id: string;
  payment_id: string;
  work_id: string;
  fee_amount: string;
  currency: string;
  collected_at: Date;
}