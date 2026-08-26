import { WorkerLoginResponseRMQDTO } from "../../dtos/worker/WorkerLoginRMQDTO";

export interface IWorkerValidationClient {
    validateWorker(email: string, password: string): Promise<WorkerLoginResponseRMQDTO>;
}