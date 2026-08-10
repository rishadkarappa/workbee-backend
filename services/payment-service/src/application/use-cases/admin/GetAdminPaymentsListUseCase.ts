import { inject, injectable } from "tsyringe";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IGetAdminPaymentsListUseCase } from "../../ports/admin/IGetAdminPaymentsListUseCase";

import { AdminPaymentsListRequestDTO, AdminPaymentsListResponseDTO } from "../../dtos/admin/AdminPaymentDTO";

import { PaymentMapper } from "../../mappers/PaymentMapper";

@injectable()
export class GetAdminPaymentsListUseCase implements IGetAdminPaymentsListUseCase {
  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository
  ) {}

  async execute(data: AdminPaymentsListRequestDTO): Promise<AdminPaymentsListResponseDTO> {
    const { payments, total, totalPages } = await this.paymentRepo.findAllPaginated(data.page, data.limit);
    return {
      payments: PaymentMapper.toAdminDTOList(payments),
      total,
      totalPages,
    };
  }
}