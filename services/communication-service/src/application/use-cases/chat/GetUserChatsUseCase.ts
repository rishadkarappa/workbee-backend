import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { Chat } from '../../../domain/entities/Chat';
import { GetUserChatsDTO } from '../../dtos/chat/ChatDTO';
import { IGetUserChatsUseCase } from '../../ports/chat/IGetUserChatsUseCase';
import { ChatMapper } from '../../mappers/ChatMapper';
import { ICacheService } from '../../../domain/services/ICacheService';


@injectable()
export class GetUserChatsUseCase implements IGetUserChatsUseCase {
  constructor(
    @inject("ChatRepository") private chatRepository: IChatRepository,
    @inject("CacheService") private cacheService: ICacheService
  ) { }

  async execute(data: GetUserChatsDTO): Promise<Chat[]> {
    const { userId, role } = data;

    const chats =
      role === "user"
        ? await this.chatRepository.findByUserId(userId)
        : await this.chatRepository.findByWorkerId(userId);

    return ChatMapper.toChatListWithParticipants(
      chats,
      this.cacheService
    );

  }
}
