import { injectable } from "tsyringe";
import { WorkerValidationClient } from "../../../infrastructure/message-bus";
import { RabbitMQConnection } from "../../../infrastructure/message-bus";

@injectable()
export class WorkerLoginUseCase {
    async execute(email: string, password: string) {
        const channel = await RabbitMQConnection.getChannel();
        const client = new WorkerValidationClient(channel);

        const response = await client.validateWorker(email, password);

        if (!response.success) {
            throw new Error(response.error || 'Worker validation failed');
        }
        return response.data;
    }
}