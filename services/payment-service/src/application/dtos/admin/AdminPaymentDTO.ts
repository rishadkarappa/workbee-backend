export interface AdminPaymentDTO {
  id: string;
  workId: string;
  userId: string;
  workerId: string;
  amount: number;
  platformFee: number;
  workerPayout: number;
  currency: string;
  status: string;
  createdAt: Date;
}

export interface AdminPaymentsListRequestDTO {
  page: number;
  limit: number;
}
export interface AdminPaymentsListResponseDTO {
  payments: AdminPaymentDTO[];
  total: number;
  totalPages: number;
}

export interface AdminPaymentSummaryResponseDTO {
  totalRevenue: number;
  totalPlatformFees: number;
  pendingPayouts: number;
  refundedAmount: number;
}