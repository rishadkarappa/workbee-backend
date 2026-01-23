import { injectable } from 'tsyringe';
import { RabbitMQConnection } from '../config/rabbitmq';
import { INewMessageEvent } from '../../domain/message-contracts/INewMessageEvent';

@injectable()
export class MessageEventPublisher {
  private readonly EXCHANGE = 'workbee.events';
  private readonly ROUTING_KEY = 'message.new';

  async publishNewMessage(event: INewMessageEvent): Promise<void> {
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