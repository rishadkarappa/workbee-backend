import { Payment } from "../entities/Payment";


export interface IPaymentRepository {
  create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByWorkId(workId: string): Promise<Payment | null>;
  findByStripeSession(sessionId: string): Promise<Payment | null>;
  findByStripePaymentIntent(intentId: string): Promise<Payment | null>;
  updateStatus(id: string, status: string, extra?: Partial<Payment>): Promise<Payment>;
}