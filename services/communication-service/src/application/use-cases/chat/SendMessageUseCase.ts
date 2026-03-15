import { inject, injectable } from 'tsyringe';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { SendMessageDTO } from '../../dtos/chat/ChatDTO';
import { Message } from '../../../domain/entities/Message';
import { ISendMessageUseCase } from '../../ports/chat/ISendMessageUseCase';

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject('MessageRepository') private messageRepository: IMessageRepository,
    @inject('ChatRepository')    private chatRepository:    IChatRepository
  ) {}

  async execute(data: SendMessageDTO): Promise<Message> {
    const message: Message = {
      chatId:     data.chatId,
      senderId:   data.senderId,
      senderRole: data.senderRole,
      content:    data.content,
      type:       data.type || 'text',
      mediaUrl:      data.mediaUrl,
      mediaPublicId: data.mediaPublicId,
      isRead: false,
    };

    const savedMessage = await this.messageRepository.create(message);

    // Update last message preview — for media use a friendly label
    const previewText = data.type === 'image'
      ? '📷 Image'
      : data.type === 'video'
        ? '🎥 Video'
        : data.content;

    await this.chatRepository.updateLastMessage(data.chatId, previewText);

    // Increment unread count for the recipient
    // sender = 'user'   → recipient key = 'workerId'
    // sender = 'worker' → recipient key = 'userId'
    const recipientRole: 'userId' | 'workerId' =
      data.senderRole === 'user' ? 'workerId' : 'userId';

    await this.chatRepository.incrementUnreadCount(data.chatId, recipientRole);

    return savedMessage;
  }
}