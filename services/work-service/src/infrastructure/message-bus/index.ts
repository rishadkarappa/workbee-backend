import { container } from 'tsyringe';
import { RabbitMQConnection } from './RabbitMQConnection';
import { WorkerValidationConsumer } from './WorkerValidationConsumer';
import { UserValidationConsumer } from './UserValidationConsumer';

export class RabbitMQClient {
    private static isInitialized = false;

    static async initialize(): Promise<void> {
        if (this.isInitialized) {
            console.log('-- Messaging service already initialized');
            return;
        }

        try {
            await RabbitMQConnection.connect();
            console.log('-- RabbitMQ connected');

            const channel = await RabbitMQConnection.getChannel();

            // Start Worker Validation Consumer
            const workerValidationConsumer = container.resolve(WorkerValidationConsumer);
            await workerValidationConsumer.start(channel);
            console.log('-- Worker Validation Consumer started');

            // Start User Validation Consumer
            const userValidationConsumer = container.resolve(UserValidationConsumer);
            await userValidationConsumer.start(channel);
            console.log('-- User Validation Consumer started');

            this.isInitialized = true;
            console.log('-- Messaging Service initialized successfully');
        } catch (error) {
            console.error('-- Failed to initialize Messaging Service:', error);
            throw error;
        }
    }
}

export { RabbitMQConnection } from './RabbitMQConnection';
export { WorkerValidationConsumer } from './WorkerValidationConsumer';
export { UserValidationConsumer } from './UserValidationConsumer';