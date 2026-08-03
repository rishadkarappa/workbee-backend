import { container } from 'tsyringe';
import { RabbitMQConnection } from '../config/rabbitmq';
import { WorkerValidationConsumer } from './WorkerValidationConsumer';
import { logger } from '../logger/logger';

export class RabbitMQInitializer {
    private static isInitialized = false;

    static async initialize(): Promise<void> {
        if (this.isInitialized) {
            logger.info('- Messaging service already initialized');
            return;
        }

        try {
            await RabbitMQConnection.connect();
            logger.info('- RabbitMQ connected');

            const channel = await RabbitMQConnection.getChannel();

            // consumers
            // Start Worker Validation Consumer
            const workerValidationConsumer = container.resolve(WorkerValidationConsumer);
            await workerValidationConsumer.start(channel);
            logger.info('- Worker Validation Consumer started');


            this.isInitialized = true;
            logger.info('- Messaging Service initialized successfully');
        } catch (error) {
            logger.error('- Failed to initialize Messaging Service:', error);
            throw error;
        }
    }
}

export { RabbitMQConnection } from '../config/rabbitmq';
export { WorkerValidationConsumer } from './WorkerValidationConsumer';
