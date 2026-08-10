import { AdminPaymentsListResponseDTO } from "../../dtos/admin/AdminPaymentDTO";

export interface IGetAdminPaymentsListUseCase {
  execute(page: number, limit: number): Promise<AdminPaymentsListResponseDTO>;
}