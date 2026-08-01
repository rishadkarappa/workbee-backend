import { Server } from 'socket.io';
import { container } from 'tsyringe';
import { SendMessageUseCase } from '../../../application/use-cases/chat/SendMessageUseCase';
import { CacheService } from '../../services/CacheService';
import { MessageEventPublisher } from '../../message-bus/MessageEventPublisher';
import { getErrorMessage, UserRole } from 'workbee-common';
import { AuthenticatedSocket, SendMessagePayload } from '../types/SocketTypes'

export class ChatHandler {
  constructor(
    private io: Server,
    private userSockets: Map<string, string>,
    private cacheService: CacheService,
    private messageEventPublisher: MessageEventPublisher,
  ) {}

  public register(socket: AuthenticatedSocket): void {
    socket.on('join_chat', (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on('leave_chat', (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    socket.on('send_message', (data: SendMessagePayload) => this.handleSendMessage(socket, data));
  }

  private async handleSendMessage(socket: AuthenticatedSocket, data: SendMessagePayload): Promise<void> {
    try {
      if (!socket.userId || !socket.userRole) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      const sendMessageUseCase = container.resolve(SendMessageUseCase);

      const savedMessage = await sendMessageUseCase.execute({
        chatId: data.chatId,
        senderId: socket.userId,
        senderRole: socket.userRole as UserRole.USER | UserRole.WORKER,
        content: data.content,
        type: data.type,
        mediaUrl: data.mediaUrl,
        mediaPublicId: data.mediaPublicId,
      });

      let senderProfile;
      if (socket.userRole === UserRole.USER) {
        senderProfile = await this.cacheService.getUserProfile(socket.userId);
      } else {
        senderProfile = await this.cacheService.getWorkerProfile(socket.userId);
      }

      const enrichedMessage = {
        ...savedMessage,
        chatId: data.chatId,
        senderDetails: senderProfile
          ? { name: senderProfile.name, avatar: senderProfile.avatar }
          : undefined,
      };

      this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

      if (data.recipientId) {
        const recipientSocketId = this.userSockets.get(data.recipientId);
        if (recipientSocketId) {
          const recipientSocket = this.io.sockets.sockets.get(recipientSocketId);
          const isInChatRoom = recipientSocket?.rooms.has(`chat:${data.chatId}`);

          if (!isInChatRoom) {
            this.io.to(`user:${data.recipientId}`).emit('new_message', enrichedMessage);
          }
        }
      }

      if (data.recipientId && senderProfile) {
        const previewContent =
          data.type === 'image' ? '📷 Image'
            : data.type === 'video' ? '🎥 Video'
              : data.content;

        await this.messageEventPublisher.publishNewMessage({
          userId: data.recipientId,
          senderId: socket.userId,
          senderName: senderProfile.name,
          senderRole: socket.userRole as UserRole.USER | UserRole.WORKER,
          chatId: data.chatId,
          messageContent: previewContent,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      socket.emit('error', { message: getErrorMessage(error) });
    }
  }
}