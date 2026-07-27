export interface TransactionRow {
  id: string;
  wallet_id: string;
  work_id: string | null;
  razorpay_payment_id: string | null;
  type: string;
  amount: string;
  currency: string;
  status: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}