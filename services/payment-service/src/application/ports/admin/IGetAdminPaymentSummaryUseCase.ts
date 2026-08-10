import { AdminPaymentSummaryResponseDTO } from "../../dtos/admin/AdminPaymentDTO";

export interface IGetAdminPaymentSummaryUseCase {
  execute(): Promise<AdminPaymentSummaryResponseDTO>;
}