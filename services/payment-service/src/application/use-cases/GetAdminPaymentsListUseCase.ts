// src/application/use-cases/GetAdminPaymentsListUseCase.ts
import { inject, injectable } from "tsyringe";
import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";

@injectable()
export class GetAdminPaymentsListUseCase {
  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository
  ) {}

  async execute(page = 1, limit = 20) {
    return this.paymentRepo.findAllPaginated(page, limit);
  }
}