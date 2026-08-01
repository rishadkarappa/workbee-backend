import { logger } from "../config/logger";
import { RabbitMQConnection } from "../config/rabbitmq";

export class RabbitMQClient {
    private static isInitialized = false;

    static async initialize(): Promise<void> {
        if (this.isInitialized) {
            logger.warn('-- Messaging service already initialized');
            return;
        }

        try {
            await RabbitMQConnection.connect();
            logger.info('-- RabbitMQ connected');

            this.isInitialized = true;
            logger.info('-- Messaging Service initialized successfully');
        } catch (error) {
            logger.error('-- Failed to initialize Messaging Service:', error);
            throw error;
        }
    }
}