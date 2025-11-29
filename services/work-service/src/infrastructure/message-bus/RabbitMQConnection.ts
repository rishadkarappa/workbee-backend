import amqp from 'amqplib';

export class RabbitMQConnection {
    private static connection: any = null;
    private static channel: any = null;

    static async connect(): Promise<void> {
        if (this.connection) return;

        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            this.channel = await this.connection.createChannel();
            console.log('-- RabbitMQ connected successfully');
        } catch (error) {
            console.error('-- RabbitMQ connection failed:', error);
            throw error;
        }
    }

    static async getChannel(): Promise<any> {
        if (!this.channel) {
            await this.connect();
        }
        return this.channel!;
    }

    static async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}