export interface VerifyPaymentRequestDTO {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
export interface VerifyPaymentResponseDTO {
  success: boolean;
  paymentId: string;
}