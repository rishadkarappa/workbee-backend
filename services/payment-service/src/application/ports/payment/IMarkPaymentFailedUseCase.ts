import { MarkPaymentFailedRequestDTO, MarkPaymentFailedResponseDTO } from "../../dtos/payment/MarkPaymentFailedDTO";

export interface IMarkPaymentFailedUseCase {
  execute(data: MarkPaymentFailedRequestDTO): Promise<MarkPaymentFailedResponseDTO>;
}