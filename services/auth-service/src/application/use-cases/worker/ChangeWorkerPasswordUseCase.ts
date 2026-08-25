import { injectable } from "tsyringe";

import { IChangeWorkerPasswordUseCase } from "../../ports/worker/IChangeWorkerPasswordUseCase";
import { ChangeWorkerPasswordRequestDTO } from "../../dtos/worker/ChangeWorkerPasswordDTO";

import { RabbitMQConnection } from "../../../infrastructure/config/rabbitmq";
import { WorkerChangePasswordClient } from "../../../infrastructure/message-bus/WorkerChangePasswordClient";

@injectable()
export class ChangeWorkerPasswordUseCasen implements IChangeWorkerPasswordUseCase {

    async execute(workerId: string, data: ChangeWorkerPasswordRequestDTO): Promise<void> {

        const { currentPassword, newPassword } = data;

        const channel = await RabbitMQConnection.getChannel();
        const client = new WorkerChangePasswordClient(channel);

        const response = await client.changePassword(workerId, currentPassword, newPassword);

        if (!response.success) {
            throw new Error(response.error || "Failed to change worker password");
        }
    }
}




