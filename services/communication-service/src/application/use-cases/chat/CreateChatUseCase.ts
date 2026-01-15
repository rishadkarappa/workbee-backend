import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { CreateChatDTO } from '../../dtos/chat/ChatDTO';
import { Chat } from '../../../domain/entities/Chat';
import { ICreateChatUseCase } from '../../ports/chat/ICreateChatUseCase';
import { ChatMapper } from '../../mappers/ChatMapper';
import { ICacheService } from '../../../domain/services/ICacheService';

@injectable()
export class CreateChatUseCase implements ICreateChatUseCase {
  constructor(
    @inject("ChatRepository") private chatRepository: IChatRepository,
    @inject("CacheService") private cacheService: ICacheService
  ) { }

  async execute(data: CreateChatDTO): Promise<Chat> {
    const existingChat = await this.chatRepository.findByParticipants(
      data.userId,
      data.workerId
    );

    if (existingChat) {
      const userProfile = await this.cacheService.getUserProfile(data.userId);
      const workerProfile = await this.cacheService.getWorkerProfile(data.workerId);

      return {
        ...existingChat,
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
    }

    const chat = existingChat ?? await this.chatRepository.create({
      participants: {
        userId: data.userId,
        workerId: data.workerId
      }
    });

    return ChatMapper.toChatWithParticipants(
      chat,
      this.cacheService
    );

  }
}
