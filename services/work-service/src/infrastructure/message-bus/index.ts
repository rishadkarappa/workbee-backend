import { container } from 'tsyringe';
import { RabbitMQConnection } from './RabbitMQConnection';
import { WorkerValidationConsumer } from './WorkerValidationConsumer';

export class RabbitMQClient {
    private static isInitialized = false;

    static async initialize(): Promise<void> {
        if (this.isInitialized) {
            console.log('⚠️ Messaging service already initialized');
            return;
        }

        try {
            // Connect to RabbitMQ
            await RabbitMQConnection.connect();
            console.log(' RabbitMQ connected');

            // Get channel
            const channel = await RabbitMQConnection.getChannel();

            // Start consumers
            const workerValidationConsumer = container.resolve(WorkerValidationConsumer);
            await workerValidationConsumer.start(channel);
            console.log('Worker Validation Consumer started');

            this.isInitialized = true;
            console.log('Messaging Service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Messaging Service:', error);
            throw error;
        }
    }
}

// Export individual components if needed
export { RabbitMQConnection } from './RabbitMQConnection';
export { WorkerValidationConsumer } from './WorkerValidationConsumer';