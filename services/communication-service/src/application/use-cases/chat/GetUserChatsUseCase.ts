import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { Chat } from '../../../domain/entities/Chat';
import { CacheService } from '../../../infrastructure/services/CacheService';

@injectable()
export class GetUserChatsUseCase {
  constructor(
    @inject("ChatRepository") private chatRepository: IChatRepository,
    @inject("CacheService") private cacheService: CacheService
  ) {}

  async execute(userId: string, role: "user" | "worker"): Promise<Chat[]> {
    let chats: Chat[];
    
    if (role === "user") {
      chats = await this.chatRepository.findByUserId(userId);
    } else {
      chats = await this.chatRepository.findByWorkerId(userId);
    }

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const userProfile = await this.cacheService.getUserProfile(chat.participants.userId);
        const workerProfile = await this.cacheService.getWorkerProfile(chat.participants.workerId);

        return {
          ...chat,
          participantDetails: {
            user: userProfile ? {
              id: userProfile.id,
              name: userProfile.name,
              avatar: userProfile.avatar
            } : undefined,
            worker: workerProfile ? {
              id: workerProfile.id,
              name: workerProfile.name,
              avatar: workerProfile.avatar
            } : undefined
          }
        };
      })
    );

    return enrichedChats;
  }
}
