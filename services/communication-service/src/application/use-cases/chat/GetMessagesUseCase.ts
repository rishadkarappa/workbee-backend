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
    @inject("MessageRepository") private readonly _messageRepository: IMessageRepository,
    @inject("CacheService") private readonly _cacheService: ICacheService
  ) { }

  async execute(data: GetMessagesDTO): Promise<Message[]> {
    const messages = await this._messageRepository.findByChatId(
      data.chatId,
      data.limit,   // undefined = no limit = fetch all
      data.offset   // undefined = no skip
    );

    return ChatMapper.toMessageListWithSender(
      messages,
      this._cacheService
    );
  }
}