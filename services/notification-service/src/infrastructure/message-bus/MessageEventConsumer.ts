import { injectable, inject } from 'tsyringe';
import { RabbitMQConnection } from '../config/rabbitmq';
import { CreateNotificationUseCase } from '../../application/use-cases/CreateNotificationUseCase';
import { SocketManager } from '../socket/NotificationSocketManager';
import { INewMessageEvent } from '../../domain/message-contracts/INewMessageEvent';

@injectable()
export class MessageEventConsumer {
  private readonly EXCHANGE = 'workbee.events';
  private readonly QUEUE = 'notification.new_message';
  private readonly ROUTING_KEY = 'message.new';

  constructor(
    @inject("CreateNotificationUseCase") private createNotificationUseCase: CreateNotificationUseCase,
    @inject("SocketManager") private socketManager: SocketManager
  ) {}

  async start(): Promise<void> {
    try {
      const channel = await RabbitMQConnection.getChannel();

      // Assert exchange
      await channel.assertExchange(this.EXCHANGE, 'topic', { durable: true });

      // Assert queue
      await channel.assertQueue(this.QUEUE, { durable: true });

      // Bind queue to exchange
      await channel.bindQueue(this.QUEUE, this.EXCHANGE, this.ROUTING_KEY);

      console.log(`Waiting for messages in queue: ${this.QUEUE}`);

      // Consume messages
      channel.consume(
        this.QUEUE,
        async (msg: any) => {
          if (msg) {
            try {
              const event: INewMessageEvent = JSON.parse(msg.content.toString());
              await this.handleNewMessage(event);
              channel.ack(msg);
            } catch (error) {
              console.error('Error processing message:', error);
              channel.nack(msg, false, false); // Don't requeue on error
            }
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.error('Failed to start message consumer:', error);
      throw error;
    }
  }

  private async handleNewMessage(event: INewMessageEvent): Promise<void> {
    try {
      console.log(`Processing new message event for user: ${event.userId}`);

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

      console.log(`Notification created and sent to user: ${event.userId}`);
    } catch (error) {
      console.error('Error handling new message event:', error);
      throw error;
    }
  }
}