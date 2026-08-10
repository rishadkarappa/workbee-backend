import { UserRole } from "workbee-common";

export interface Wallet {
    id: string;
    ownerId: string;
    role: UserRole
    balance: number;
    pendingBalance: number;
    totalEarned: number;
    totalSpent: number;
    createdAt: Date;
    updatedAt: Date;
}