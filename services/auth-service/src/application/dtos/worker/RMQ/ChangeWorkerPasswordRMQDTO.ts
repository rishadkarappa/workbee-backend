export interface ChangeWorkerPasswordRequestRMQDTO {
    workerId: string;
    currentPassword: string;
    newPassword: string;
    correlationId: string;
}

export interface ChangeWorkerPasswordResponseRMQDTO {
    success: boolean;
    message?: string;
    error?: string;
}