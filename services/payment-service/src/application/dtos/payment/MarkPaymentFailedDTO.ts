export interface MarkPaymentFailedRequestDTO {
  razorpayOrderId: string;
  reason?: string;
}

export interface MarkPaymentFailedResponseDTO {
  recorded: boolean;
}
