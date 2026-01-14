import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { CreateChatDTO } from '../../dtos/chat/ChatDTO';
import { Chat } from '../../../domain/entities/Chat';
import { CacheService } from '../../../infrastructure/services/CacheService';
import { ICreateChatUseCase } from '../../ports/chat/ICreateChatUseCase';

@injectable()
export class CreateChatUseCase implements ICreateChatUseCase {
  constructor(
    @inject("ChatRepository") private chatRepository: IChatRepository,
    @inject("CacheService") private cacheService: CacheService
  ) {}

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

    const chat: Chat = {
      participants: {
        userId: data.userId,
        workerId: data.workerId
      }
    };

    const createdChat = await this.chatRepository.create(chat);

    const userProfile = await this.cacheService.getUserProfile(data.userId);
    const workerProfile = await this.cacheService.getWorkerProfile(data.workerId);

    return {
      ...createdChat,
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
}
