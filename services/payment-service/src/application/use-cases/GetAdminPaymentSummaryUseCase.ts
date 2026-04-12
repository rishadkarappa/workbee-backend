

import { inject, injectable } from "tsyringe";
import {
  IPlatformEarningRepository,
} from "../../domain/repositories/IPlatformEarningRepository";


@injectable()
export class GetAdminPaymentSummaryUseCase {
  constructor(
    @inject("PlatformEarningRepository") private platformEarningRepo: IPlatformEarningRepository
  ) {}
 
  async execute() {
    return this.platformEarningRepo.getAdminSummary();
  }
}