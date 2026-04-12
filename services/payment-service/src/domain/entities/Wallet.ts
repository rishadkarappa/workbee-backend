export interface Wallet {
    id: string;
    ownerId: string;
    role: "user" | "worker" | "admin";
    balance: number;
    pendingBalance: number;
    totalEarned: number;
    totalSpent: number;
    createdAt: Date;
    updatedAt: Date;
}