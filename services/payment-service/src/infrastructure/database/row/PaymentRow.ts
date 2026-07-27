import { PaymentStatus } from "../../../domain/entities/PaymentStatus";

export interface PaymentRow {
  id: string;
  work_id: string;
  user_id: string;
  worker_id: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  amount: string;
  platform_fee: string;
  worker_payout: string;
  currency: string;
  status: PaymentStatus;
  work_completed_at: Date | null;
  payout_scheduled_at: Date | null;
  payout_completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}