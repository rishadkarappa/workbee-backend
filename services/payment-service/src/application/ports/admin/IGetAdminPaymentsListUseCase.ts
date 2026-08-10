import { AdminPaymentsListRequestDTO } from "../../dtos/admin/AdminPaymentDTO";
import { AdminPaymentsListResponseDTO } from "../../dtos/admin/AdminPaymentDTO";

export interface IGetAdminPaymentsListUseCase {
  execute(data: AdminPaymentsListRequestDTO): Promise<AdminPaymentsListResponseDTO>;
}