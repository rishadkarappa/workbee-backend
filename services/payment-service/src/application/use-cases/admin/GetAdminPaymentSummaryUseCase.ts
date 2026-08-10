import { inject, injectable } from "tsyringe";
import { IPlatformEarningRepository } from "../../../domain/repositories/IPlatformEarningRepository";
import { IGetAdminPaymentSummaryUseCase } from "../../ports/admin/IGetAdminPaymentSummaryUseCase";
import { AdminPaymentSummaryResponseDTO } from "../../dtos/admin/AdminPaymentDTO";

@injectable()
export class GetAdminPaymentSummaryUseCase implements IGetAdminPaymentSummaryUseCase {
  constructor(
    @inject("PlatformEarningRepository") private platformEarningRepo: IPlatformEarningRepository
  ) {}

  async execute(): Promise<AdminPaymentSummaryResponseDTO> {
    return this.platformEarningRepo.getAdminSummary();
  }
}