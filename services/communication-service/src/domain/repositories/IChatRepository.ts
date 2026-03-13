import { Chat } from '../entities/Chat';

export interface IChatRepository {
  create(chat: Chat): Promise<Chat>;
  findById(id: string): Promise<Chat | null>;
  findByParticipants(userId: string, workerId: string): Promise<Chat | null>;
  findByUserId(userId: string): Promise<Chat[]>;
  findByWorkerId(workerId: string): Promise<Chat[]>;
  updateLastMessage(chatId: string, message: string): Promise<void>;
  incrementUnreadCount(chatId: string, recipientRole: 'userId' | 'workerId'): Promise<void>;
  resetUnreadCount(chatId: string, readerRole: 'userId' | 'workerId'): Promise<void>;
}





