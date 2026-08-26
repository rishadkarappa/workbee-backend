import { ChangeWorkerPasswordResponseRMQDTO } from "../../dtos/worker/RMQ/ChangeWorkerPasswordRMQDTO";

export interface IWorkerChangePasswordClient {
    changePassword(workerId: string, currentPassword: string, newPassword: string): Promise<ChangeWorkerPasswordResponseRMQDTO>;
}