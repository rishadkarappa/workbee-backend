

import { inject, injectable } from "tsyringe";
import Stripe from "stripe";
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