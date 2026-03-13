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
  ) {}

  async execute(data: GetUserChatsDTO): Promise<Chat[]> {
    const { userId, role } = data;

    // Raw chats from DB — contain unreadCount
    const chats =
      role === 'user'
        ? await this.chatRepository.findByUserId(userId)
        : await this.chatRepository.findByWorkerId(userId);

    // Build unread lookup by id BEFORE ChatMapper (mapper may change order)
    const unreadMap = new Map<string, { userId: number; workerId: number }>();
    chats.forEach(c => {
      if (c.id) {
        unreadMap.set(c.id, {
          userId:   c.unreadCount?.userId   ?? 0,
          workerId: c.unreadCount?.workerId ?? 0
        });
      }
    });

    // Enrich with participant details
    const chatsWithParticipants = await ChatMapper.toChatListWithParticipants(
      chats,
      this.cacheService
    );

    // Attach myUnreadCount matched by id — NOT by index
    return chatsWithParticipants.map(chat => {
      const unread = unreadMap.get(chat.id!);
      return {
        ...chat,
        myUnreadCount: role === 'user'
          ? (unread?.userId   ?? 0)
          : (unread?.workerId ?? 0)
      };
    });
  }
}