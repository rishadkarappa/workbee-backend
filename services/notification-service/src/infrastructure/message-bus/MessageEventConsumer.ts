import { injectable, inject } from 'tsyringe';
import { RabbitMQConnection } from '../config/rabbitmq';
import { CreateNotificationUseCase } from '../../application/use-cases/CreateNotificationUseCase';
import { SocketGateway } from '../socket/SocketGateway';
import { INewMessageEvent } from '../../domain/message-contracts/INewMessageEvent';
import { ConsumeMessage } from 'amqplib';
import { logger } from '../config/logger';

@injectable()
export class MessageEventConsumer {
  private readonly EXCHANGE = 'workbee.events';
  private readonly QUEUE = 'notification.new_message';
  private readonly ROUTING_KEY = 'message.new';

  constructor(
    @inject("CreateNotificationUseCase") private createNotificationUseCase: CreateNotificationUseCase,
    @inject("SocketManager") private socketManager: SocketGateway
  ) { }

  async start(): Promise<void> {
    try {
      const channel = await RabbitMQConnection.getChannel();

      // Assert exchange
      await channel.assertExchange(this.EXCHANGE, 'topic', { durable: true });

      // Assert queue
      await channel.assertQueue(this.QUEUE, { durable: true });

      // Bind queue to exchange
      await channel.bindQueue(this.QUEUE, this.EXCHANGE, this.ROUTING_KEY);

      logger.info(`Waiting for messages in queue: ${this.QUEUE}`);

      // Consume messages
      channel.consume(this.QUEUE, async (msg: ConsumeMessage | null) => {
        if (msg) {
          try {
            const event: INewMessageEvent = JSON.parse(msg.content.toString());
            await this.handleNewMessage(event);
            channel.ack(msg);
          } catch (error) {
            logger.error('Error processing message:', error);
            channel.nack(msg, false, false);
          }
        }
      },
        { noAck: false }
      );
    } catch (error) {
      logger.error('Failed to start message consumer:', error);
      throw error;
    }
  }

  private async handleNewMessage(event: INewMessageEvent): Promise<void> {
    try {
      logger.info(`Processing new message event for user: ${event.userId}`);

      // Create notification in database
      const notification = await this.createNotificationUseCase.execute({
        userId: event.userId,
        type: 'NEW_MESSAGE',
        title: 'New Message',
        message: `${event.senderName} sent you a message`,
        data: {
          chatId: event.chatId,
          senderId: event.senderId,
          senderName: event.senderName,
          senderRole: event.senderRole
        }
      });

      // Emit real-time notification via Socket.IO
      this.socketManager.emitNotificationToUser(event.userId, notification);

      logger.info(`Notification created and sent to user: ${event.userId}`);
    } catch (error) {
      logger.error('Error handling new message event:', error);
      throw error;
    }
  }
}