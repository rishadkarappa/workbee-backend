import { Server } from 'socket.io';
import { container } from 'tsyringe';
import { SendMessageUseCase } from '../../../application/use-cases/chat/SendMessageUseCase';
import { getErrorMessage, UserRole } from 'workbee-common';
import { logger } from '../../logger/logger';
import {
  AuthenticatedSocket,
  AskForConfirmPayload,
  ConfirmResponsePayload,
  WorkProgressUpdatePayload,
} from '../types/SocketTypes';

export class WorkHandler {
  constructor(private io: Server) {}

  public register(socket: AuthenticatedSocket): void {
    socket.on('ask_for_confirm', (data: AskForConfirmPayload) => this.handleAskForConfirm(socket, data));
    socket.on('confirm_response', (data: ConfirmResponsePayload) => this.handleConfirmResponse(socket, data));
    socket.on('work_progress_update', (data: WorkProgressUpdatePayload) => this.handleWorkProgressUpdate(socket, data));
  }

  private async handleAskForConfirm(socket: AuthenticatedSocket, data: AskForConfirmPayload): Promise<void> {
    try {
      if (!socket.userId || !socket.userRole) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      const sendMessageUseCase = container.resolve(SendMessageUseCase);

      const savedMessage = await sendMessageUseCase.execute({
        chatId: data.chatId,
        senderId: data.workerId,
        senderRole: UserRole.WORKER,
        content: JSON.stringify({
          type: 'WORK_CONFIRM_REQUEST',
          workId: data.workId,
          workTitle: data.workTitle,
          workerName: data.workerName,
        }),
        type: 'system',
      });

      const enrichedMessage = { ...savedMessage, chatId: data.chatId };

      this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);
      this.io.to(`user:${data.userId}`).emit('new_message', enrichedMessage);
    } catch (error) {
      logger.error('socket ask_for_confirm error:', error);
      socket.emit('error', { message: getErrorMessage(error) });
    }
  }

  private async handleConfirmResponse(socket: AuthenticatedSocket, data: ConfirmResponsePayload): Promise<void> {
    try {
      if (!socket.userId || !socket.userRole) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      const sendMessageUseCase = container.resolve(SendMessageUseCase);

      const content = data.accepted
        ? JSON.stringify({ type: 'WORK_CONFIRM_ACCEPTED', workId: data.workId, workTitle: data.workTitle })
        : JSON.stringify({ type: 'WORK_CONFIRM_REJECTED', workId: data.workId, workTitle: data.workTitle });

      const savedMessage = await sendMessageUseCase.execute({
        chatId: data.chatId,
        senderId: data.userId,
        senderRole: UserRole.USER,
        content,
        type: 'system',
      });

      const enrichedMessage = { ...savedMessage, chatId: data.chatId };

      this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

      if (data.workerId) {
        this.io.to(`user:${data.workerId}`).emit('new_message', enrichedMessage);
      }
    } catch (error) {
      logger.error('socket confirm_response error:', error);
      socket.emit('error', { message: getErrorMessage(error) });
    }
  }

  private async handleWorkProgressUpdate(socket: AuthenticatedSocket, data: WorkProgressUpdatePayload): Promise<void> {
    try {
      if (!socket.userId || !socket.userRole) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      const sendMessageUseCase = container.resolve(SendMessageUseCase);

      const savedMessage = await sendMessageUseCase.execute({
        chatId: data.chatId,
        senderId: data.workerId,
        senderRole: UserRole.WORKER,
        content: JSON.stringify({
          type: 'WORK_PROGRESS_UPDATE',
          workId: data.workId,
          workTitle: data.workTitle,
          progress: data.progress,
        }),
        type: 'system',
      });

      const enrichedMessage = { ...savedMessage, chatId: data.chatId };

      this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);
      this.io.to(`chat:${data.chatId}`).emit('work_progress_changed', {
        workId: data.workId,
        progress: data.progress,
      });
    } catch (error) {
      socket.emit('error', { message: getErrorMessage(error) });
    }
  }
}