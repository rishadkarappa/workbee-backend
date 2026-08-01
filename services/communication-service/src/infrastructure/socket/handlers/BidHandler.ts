import { Server } from 'socket.io';
import { container } from 'tsyringe';
import { IRespondToBidUseCase } from '../../../application/ports/bid/IRespondToBidUseCase';
import { ISendBidOfferUseCase } from '../../../application/ports/bid/ISendBidOfferUseCase';
import { getErrorMessage, UserRole } from 'workbee-common';
import { AuthenticatedSocket, SendBidOfferPayload, RespondBidPayload } from '../types/SocketTypes';

export class BidHandler {
  constructor(private io: Server) {}

  public register(socket: AuthenticatedSocket): void {
    socket.on('send_bid_offer', (data: SendBidOfferPayload) => this.handleSendBidOffer(socket, data));
    socket.on('respond_bid', (data: RespondBidPayload) => this.handleRespondBid(socket, data));
  }

  private async handleSendBidOffer(socket: AuthenticatedSocket, data: SendBidOfferPayload): Promise<void> {
    try {
      if (!socket.userId) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }
      const sendBidOfferUseCase = container.resolve<ISendBidOfferUseCase>('SendBidOfferUseCase');
      const { bid, systemMessageContent } = await sendBidOfferUseCase.execute(data);
      const parsed = JSON.parse(systemMessageContent);

      const message = {
        id: parsed.messageId,
        chatId: data.chatId,
        senderId: data.offeredBy === UserRole.WORKER ? data.workerId : data.userId,
        senderRole: data.offeredBy,
        content: JSON.stringify({ ...parsed, messageId: undefined }),
        type: 'system',
        isRead: false,
        createdAt: new Date(),
      };

      this.io.to(`chat:${bid.chatId}`).emit('new_message', message);
      this.io.to(`user:${bid.userId}`).emit('new_message', message);
      this.io.to(`user:${bid.workerId}`).emit('new_message', message);
    } catch (err) {
      socket.emit('error', { message: getErrorMessage(err) || 'Failed to send offer' });
    }
  }

  private async handleRespondBid(socket: AuthenticatedSocket, data: RespondBidPayload): Promise<void> {
    try {
      if (!socket.userId) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }
      const respondToBidUseCase = container.resolve<IRespondToBidUseCase>('RespondToBidUseCase');
      const { bid, systemMessageContent } = await respondToBidUseCase.execute(data);
      const parsed = JSON.parse(systemMessageContent);

      const message = {
        id: parsed.messageId,
        chatId: bid.chatId,
        senderId: data.respondedBy === UserRole.WORKER ? bid.workerId : bid.userId,
        senderRole: data.respondedBy,
        content: JSON.stringify({ ...parsed, messageId: undefined }),
        type: 'system',
        isRead: false,
        createdAt: new Date(),
      };

      this.io.to(`chat:${bid.chatId}`).emit('new_message', message);
      this.io.to(`user:${bid.userId}`).emit('new_message', message);
      this.io.to(`user:${bid.workerId}`).emit('new_message', message);
    } catch (err) {
      socket.emit('error', { message: getErrorMessage(err) || 'Failed to respond to offer' });
    }
  }
}