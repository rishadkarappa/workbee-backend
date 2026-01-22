
import { inject, injectable } from 'tsyringe';
import { IMessageRepository } from '../../../../domain/repositories/IMessageRepository';
import { IChatRepository } from '../../../../domain/repositories/IChatRepository';
import { SendMessageDTO } from '../../../dtos/chat/ChatDTO';
import { Message } from '../../../../domain/entities/Message';
import { ISendMessageUseCase } from '../../../ports/chat/ISendMessageUseCase';

export interface SendMessageResult extends Message {
  recipientId?: string;
}

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject("MessageRepository") private messageRepository: IMessageRepository,
    @inject("ChatRepository") private chatRepository: IChatRepository
  ) {}

  async execute(data: SendMessageDTO): Promise<SendMessageResult> {
    // Get chat to determine recipient
    const chat = await this.chatRepository.findById(data.chatId);
    
    if (!chat) {
      throw new Error('Chat not found');
    }

    // Determine recipient based on sender role
    let recipientId: string | undefined;
    if (data.senderRole === 'user') {
      recipientId = chat.participants.workerId;
    } else if (data.senderRole === 'worker') {
      recipientId = chat.participants.userId;
    }

    // Create message
    const message: Message = {
      chatId: data.chatId,
      senderId: data.senderId,
      senderRole: data.senderRole,
      content: data.content,
      type: data.type || 'text',
      isRead: false
    };

    const savedMessage = await this.messageRepository.create(message);

    await this.chatRepository.updateLastMessage(data.chatId, data.content);

    return {
      ...savedMessage,
      recipientId
    };
  }
}