import { RabbitMQConnection } from "../config/rabbitmq";
import { logger } from "../logger/logger";

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

            this.isInitialized = true;
            logger.info('- Messaging Service initialized successfully');
        } catch (error) {
            logger.error('- Failed to initialize Messaging Service:', error);
            throw error;
        }
    }
}