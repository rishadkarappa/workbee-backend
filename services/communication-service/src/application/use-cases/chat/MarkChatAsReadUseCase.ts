import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { MarkChatAsReadDTO } from '../../dtos/chat/ChatDTO';
import { IMarkChatAsReadUseCase } from '../../ports/chat/IMarkChatAsReadUseCase';
import { UserRole } from 'workbee-common';


@injectable()
export class MarkChatAsReadUseCase implements IMarkChatAsReadUseCase {
  constructor(
    @inject("ChatRepository") private readonly _chatRepository: IChatRepository
  ) {}

  async execute(dto: MarkChatAsReadDTO): Promise<void> {
    // role 'user'   - resets unreadCount.userId
    // role 'worker' - resets unreadCount.workerId
    const readerRole: 'userId' | 'workerId' =
      dto.role === UserRole.USER ? 'userId' : 'workerId';

    await this._chatRepository.resetUnreadCount(dto.chatId, readerRole);
  }
}