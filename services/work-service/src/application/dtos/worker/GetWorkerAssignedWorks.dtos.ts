
export interface GetWorkerAssignedWorksDto {
    workerId : string;
}

export interface GetWorkerAssignedWorksResponseDto {
    id: string;
    workTitle: string;
    workCategory: string;
    status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
    budget?: number;
    createdAt: Date;
}