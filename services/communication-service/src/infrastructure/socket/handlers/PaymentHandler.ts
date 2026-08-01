import { Server } from 'socket.io';
import { container } from 'tsyringe';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { getErrorMessage, UserRole } from 'workbee-common';
import { AuthenticatedSocket, BidPaymentCompletedPayload } from '../types/SocketTypes';

export class PaymentHandler {
  constructor(private io: Server) {}

  public register(socket: AuthenticatedSocket): void {
    socket.on('bid_payment_completed', (data: BidPaymentCompletedPayload) =>
      this.handleBidPaymentCompleted(socket, data),
    );
  }

  private async handleBidPaymentCompleted(socket: AuthenticatedSocket, data: BidPaymentCompletedPayload): Promise<void> {
    try {
      const messageRepository = container.resolve<IMessageRepository>('MessageRepository');
      const chatRepository = container.resolve<IChatRepository>('ChatRepository');

      const payload = { type: 'WORK_BID_PAID', ...data };
      const saved = await messageRepository.create({
        chatId: data.chatId,
        senderId: data.userId,
        senderRole: UserRole.USER,
        content: JSON.stringify(payload),
        type: 'system',
        isRead: false,
      });
      await chatRepository.updateLastMessage(data.chatId, `Payment of ₹${data.amount} completed`);

      const message = {
        id: saved.id,
        chatId: data.chatId,
        senderId: data.userId,
        senderRole: UserRole.USER,
        content: JSON.stringify(payload),
        type: 'system',
        isRead: false,
        createdAt: new Date(),
      };

      this.io.to(`chat:${data.chatId}`).emit('new_message', message);
      this.io.to(`user:${data.userId}`).emit('new_message', message);
      this.io.to(`user:${data.workerId}`).emit('new_message', message);
    } catch (err) {
      socket.emit('error', { message: getErrorMessage(err) || 'Failed to record payment' });
    }
  }
}