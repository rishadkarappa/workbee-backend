import { container } from "tsyringe";
import { logger } from "../config/logger";
import { RabbitMQConnection } from "../config/rabbitmq";
import { MessageEventConsumer } from "./MessageEventConsumer";

export class RabbitMQInitializer {
    private static isInitialized = false;

    static async initialize(): Promise<void> {
        if (this.isInitialized) {
            logger.warn('- Messaging service already initialized');
            return;
        }

        try {
            await RabbitMQConnection.connect();
            logger.info('- RabbitMQ connected');

            const messageConsumer = container.resolve(MessageEventConsumer);
            await messageConsumer.start();
            logger.info("- Message event consumer started");

            this.isInitialized = true;
            logger.info('- Messaging Service initialized successfully');
        } catch (error) {
            logger.error('- Failed to initialize Messaging Service:', error);
            throw error;
        }
    }
}