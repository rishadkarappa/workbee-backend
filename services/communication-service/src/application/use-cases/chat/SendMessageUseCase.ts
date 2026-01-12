import { inject, injectable } from 'tsyringe';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { SendMessageDTO } from '../../dtos/chat/ChatDTO';
import { Message } from '../../../domain/entities/Message';

@injectable()
export class SendMessageUseCase {
  constructor(
    @inject("MessageRepository") private messageRepository: IMessageRepository,
    @inject("ChatRepository") private chatRepository: IChatRepository
  ) {}

  async execute(data: SendMessageDTO): Promise<Message> {
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

    return savedMessage;
  }
}