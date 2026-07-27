import { PaymentStatus } from "./PaymentStatus";

export interface Payment {
    id: string;
    workId: string;
    userId: string;
    workerId: string;
    razorpayOrderId?:string;
    razorpayPaymentId?:string;  
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