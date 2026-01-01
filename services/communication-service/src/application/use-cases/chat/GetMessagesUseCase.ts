import { inject, injectable } from 'tsyringe';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { GetMessagesDTO } from '../../dtos/chat/ChatDTO';
import { Message } from '../../../domain/entities/Message';
import { CacheService } from '../../../infrastructure/services/CacheService';

@injectable()
export class GetMessagesUseCase {
  constructor(
    @inject("MessageRepository") private messageRepository: IMessageRepository,
    @inject("CacheService") private cacheService: CacheService
  ) {}

  async execute(data: GetMessagesDTO): Promise<Message[]> {
    const messages = await this.messageRepository.findByChatId(
      data.chatId,
      data.limit,
      data.offset
    );

    // Enrich messages with sender details
    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        let senderProfile;
        
        if (message.senderRole === 'user') {
          senderProfile = await this.cacheService.getUserProfile(message.senderId);
        } else {
          senderProfile = await this.cacheService.getWorkerProfile(message.senderId);
        }

        return {
          ...message,
          senderDetails: senderProfile ? {
            name: senderProfile.name,
            avatar: senderProfile.avatar
          } : undefined
        };
      })
    );

    return enrichedMessages;
  }
}
