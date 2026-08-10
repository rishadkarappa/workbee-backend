import { VerifyPaymentRequestDTO } from "../../dtos/payment/VerifyPaymentDTO";
import { VerifyPaymentResponseDTO } from "../../dtos/payment/VerifyPaymentDTO";

export interface IVerifyRazorpayPaymentUseCase {
  execute(data: VerifyPaymentRequestDTO): Promise<VerifyPaymentResponseDTO>;
}