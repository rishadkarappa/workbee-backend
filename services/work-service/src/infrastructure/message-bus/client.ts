import { container } from 'tsyringe';
import { RabbitMQConnection } from '../config/rabbitmq';
import { WorkerValidationConsumer } from './WorkerValidationConsumer';

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


            this.isInitialized = true;
            console.log('-- Messaging Service initialized successfully');
        } catch (error) {
            console.error('-- Failed to initialize Messaging Service:', error);
            throw error;
        }
    }
}

export { RabbitMQConnection } from '../config/rabbitmq';
export { WorkerValidationConsumer } from './WorkerValidationConsumer';
