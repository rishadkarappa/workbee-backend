import { RabbitMQConnection } from './RabbitMQConnection';

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

            this.isInitialized = true;
            console.log('-- Messaging Service initialized successfully');
        } catch (error) {
            console.error('-- Failed to initialize Messaging Service:', error);
            throw error;
        }
    }
}

export { RabbitMQConnection } from './RabbitMQConnection';
export { WorkerValidationClient } from './WorkerValidationClient';
export { UserValidationClient } from './UserValidationClient';