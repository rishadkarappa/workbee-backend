import { Payment } from "../../domain/entities/Payment";
import { AdminPaymentDTO } from "../dtos/admin/AdminPaymentDTO";

export class PaymentMapper {
  static toAdminDTO(payment: Payment): AdminPaymentDTO {
    return {
      id: payment.id,
      workId: payment.workId,
      userId: payment.userId,
      workerId: payment.workerId,
      amount: payment.amount,
      platformFee: payment.platformFee,
      workerPayout: payment.workerPayout,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.createdAt,
    };
  }

  static toAdminDTOList(payments: Payment[]): AdminPaymentDTO[] {
    return payments.map(this.toAdminDTO);
  }
}