import { injectable } from 'tsyringe';
import { RabbitMQConnection } from '../config/rabbitmq';

export interface NewMessageEvent {
  userId: string; // recipient user ID
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'worker';
  chatId: string;
  messageContent: string;
  timestamp: Date;
}

@injectable()
export class MessageEventPublisher {
  private readonly EXCHANGE = 'workbee.events';
  private readonly ROUTING_KEY = 'message.new';

  async publishNewMessage(event: NewMessageEvent): Promise<void> {
    try {
      const channel = await RabbitMQConnection.getChannel();
      
      // Declare exchange
      await channel.assertExchange(this.EXCHANGE, 'topic', { durable: true });

      // Publish message
      const message = Buffer.from(JSON.stringify(event));
      channel.publish(this.EXCHANGE, this.ROUTING_KEY, message, {
        persistent: true,
        contentType: 'application/json',
      });

      console.log(`Published new message event for user: ${event.userId}`);
    } catch (error) {
      console.error('Failed to publish message event:', error);
      throw error;
    }
  }
}