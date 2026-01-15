import { inject, injectable } from 'tsyringe';
import { GetMessagesDTO } from '../../dtos/chat/ChatDTO';
import { Message } from '../../../domain/entities/Message';
import { ChatMapper } from '../../mappers/ChatMapper';

import { IGetMessagesUseCase } from '../../ports/chat/IGetMessagesUseCase';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { ICacheService } from '../../../domain/services/ICacheService';

@injectable()
export class GetMessagesUseCase implements IGetMessagesUseCase {
  constructor(
    @inject("MessageRepository") private messageRepository: IMessageRepository,
    @inject("CacheService") private cacheService: ICacheService
  ) { }

  async execute(data: GetMessagesDTO): Promise<Message[]> {
    const messages = await this.messageRepository.findByChatId(
      data.chatId,
      data.limit,
      data.offset
    );

    return ChatMapper.toMessageListWithSender(
      messages,
      this.cacheService
    );
  }
}
