export type PaymentStatus =
    | "pending"
    | "paid"
    | "worker_credited"
    | "refunded"
    | "failed";

export interface Payment {
    id: string;
    workId: string;
    userId: string;
    workerId: string;
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    amount: number;
    platformFee: number;
    workerPayout: number;
    currency: string;
    status: PaymentStatus;
    workCompletedAt?: Date;
    payoutScheduledAt?: Date;
    payoutCompletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}