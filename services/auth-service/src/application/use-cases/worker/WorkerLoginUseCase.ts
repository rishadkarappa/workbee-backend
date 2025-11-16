// import { injectable } from "tsyringe";
// import { WorkerValidationClient } from "../../../infrastructure/message-bus";
// import { RabbitMQConnection } from "../../../infrastructure/message-bus";

// @injectable()
// export class WorkerLoginUseCase {
//     async execute(email: string, password: string) {
//         const channel = await RabbitMQConnection.getChannel();
//         const client = new WorkerValidationClient(channel);

//         const response = await client.validateWorker(email, password);

//         if (!response.success) {
//             throw new Error(response.error || 'Worker validation failed');
//         }
//         return response.data;
//     }
// }

import { injectable } from "tsyringe";
import {
    WorkerLoginRequestDTO,
    WorkerLoginResponseDTO
} from "../../dtos/worker/LoginWorkerDTO";

import {
    WorkerLoginRequestRMQDTO,
    WorkerLoginResponseRMQDTO
} from "../../dtos/worker/WorkerLoginRMQDTO";

import { WorkerValidationClient, RabbitMQConnection } from "../../../infrastructure/message-bus";

@injectable()
export class WorkerLoginUseCase {
    async execute(data: WorkerLoginRequestDTO): Promise<WorkerLoginResponseDTO> {

        const { email, password } = data;

        const channel = await RabbitMQConnection.getChannel();
        const client = new WorkerValidationClient(channel);

        const response: WorkerLoginResponseRMQDTO =
            await client.validateWorker(email, password);

        if (!response.success) {
            throw new Error(response.error || "Worker validation failed");
        }

        return response.data as WorkerLoginResponseDTO;
    }
}
