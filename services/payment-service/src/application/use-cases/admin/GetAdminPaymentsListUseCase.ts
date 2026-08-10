import { inject, injectable } from "tsyringe";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IGetAdminPaymentsListUseCase } from "../../ports/admin/IGetAdminPaymentsListUseCase";

@injectable()
export class GetAdminPaymentsListUseCase implements IGetAdminPaymentsListUseCase {
  constructor(
    @inject("PaymentRepository") private paymentRepo: IPaymentRepository
  ) {}

  async execute(page = 1, limit = 20) {
    return this.paymentRepo.findAllPaginated(page, limit);
  }
}