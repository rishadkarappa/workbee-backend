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
import { WorkerMapper } from "../../mappers/WorkerMapper";
import { IWorkerLoginUseCase } from "../../ports/worker/IWorkerLoginUseCase";

@injectable()
export class WorkerLoginUseCase implements IWorkerLoginUseCase{
    async execute(data: WorkerLoginRequestDTO): Promise<WorkerLoginResponseDTO> {

        const { email, password } = data;

        const channel = await RabbitMQConnection.getChannel();
        const client = new WorkerValidationClient(channel);

        const response: WorkerLoginResponseRMQDTO =
            await client.validateWorker(email, password);

        if (!response.success) {
            throw new Error(response.error || "Worker validation failed");
        }
        return WorkerMapper.toLoginResponse(response.data);

    }
}
