import { inject, injectable } from 'tsyringe';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { SendMessageDTO } from '../../dtos/chat/ChatDTO';
import { Message } from '../../../domain/entities/Message';
import { ISendMessageUseCase } from '../../ports/chat/ISendMessageUseCase';

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject('MessageRepository') private readonly _messageRepository: IMessageRepository,
    @inject('ChatRepository') private readonly _chatRepository: IChatRepository
  ) { }

  async execute(data: SendMessageDTO): Promise<Message> {
    const message: Message = {
      chatId: data.chatId,
      senderId: data.senderId,
      senderRole: data.senderRole,
      content: data.content,
      type: data.type || 'text',
      mediaUrl: data.mediaUrl,
      mediaPublicId: data.mediaPublicId,
      isRead: false,
    };

    const savedMessage = await this._messageRepository.create(message);

    await this._chatRepository.updateLastMessage(data.chatId, this.getPreviewText(data));

    const recipientRole: 'userId' | 'workerId' =
      data.senderRole === 'user' ? 'workerId' : 'userId';

    await this._chatRepository.incrementUnreadCount(data.chatId, recipientRole);

    return savedMessage;
  }

  // Friendly, human-readable preview for the chat list — never raw JSON.
  private getPreviewText(data: SendMessageDTO): string {
    if (data.type === 'image') return '📷 Image';
    if (data.type === 'video') return '🎥 Video';

    if (data.type === 'system') {
      try {
        const parsed = JSON.parse(data.content);
        switch (parsed.type) {
          case 'WORK_CONFIRM_REQUEST':
            return 'Confirmation requested';
          case 'WORK_CONFIRM_ACCEPTED':
            return 'Deal confirmed';
          case 'WORK_CONFIRM_REJECTED':
            return 'Deal rejected';
          case 'WORK_PROGRESS_UPDATE': {
            const label =
              parsed.progress === 'started' ? 'Work started' :
              parsed.progress === 'ongoing' ? 'Work in progress' :
              parsed.progress === 'completed' ? 'Work completed' :
              `Progress: ${parsed.progress}`;
            return label;
          }
          case 'WORK_BID_OFFER':
            return `Offered ₹${parsed.amount}`;
          case 'WORK_BID_COUNTER':
            return `Countered ₹${parsed.amount}`;
          case 'WORK_BID_ACCEPTED':
            return `Offer accepted — ₹${parsed.amount}`;
          case 'WORK_BID_REJECTED':
            return 'Offer rejected';
          case 'WORK_BID_PAID':
            return `Payment of ₹${parsed.amount} completed`;
          default:
            return 'New update';
        }
      } catch {
        return 'New update';
      }
    }

    return data.content;
  }
}