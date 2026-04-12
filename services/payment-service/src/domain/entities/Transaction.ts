export type TransactionType =
    | "payment"
    | "credit"
    | "platform_fee"
    | "refund"
    | "hold"
    | "release";

export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";

export interface Transaction {
    id: string;
    walletId: string;
    workId?: string;
    stripePaymentIntentId?: string;
    type: TransactionType;
    amount: number;
    currency: string;
    status: TransactionStatus;
    description?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}