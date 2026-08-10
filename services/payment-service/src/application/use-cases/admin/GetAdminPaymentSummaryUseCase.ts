import { inject, injectable } from "tsyringe";
import { IPlatformEarningRepository } from "../../../domain/repositories/IPlatformEarningRepository";
import { IGetAdminPaymentSummaryUseCase } from "../../ports/admin/IGetAdminPaymentSummaryUseCase";


@injectable()
export class GetAdminPaymentSummaryUseCase implements IGetAdminPaymentSummaryUseCase {
  constructor(
    @inject("PlatformEarningRepository") private platformEarningRepo: IPlatformEarningRepository
  ) {}
 
  async execute() {
    return this.platformEarningRepo.getAdminSummary();
  }
}