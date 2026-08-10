import { Payment } from "../../../domain/entities/Payment";

export interface IGetAdminPaymentsListUseCase {
    execute(page: number, limit: number):
        Promise<{
            payments: Payment[]; total: number; totalPages: number
        }>
}