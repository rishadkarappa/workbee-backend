import { Payment } from "../entities/Payment";

export interface IPaymentRepository {
    create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByWorkId(workId: string): Promise<Payment | null>;
    findByRazorpayOrderId(orderId: string): Promise<Payment | null>;
    findByRazorpayPaymentId(paymentId: string): Promise<Payment | null>;
    updateStatus(id: string, status: string, extra?: Partial<Payment>): Promise<Payment>;
    findAllPaginated(page: number, limit: number): Promise<{
        payments: Payment[];
        total: number;
        totalPages: number;
    }>;
    // to admin dash stati
    countCompletedPayments(): Promise<number>;
    findPendingPayouts(limit: number): Promise<Payment[]>;
    getMonthlyRevenue(months: number): Promise<{ month: number; year: number; amount: number }[]>;
}