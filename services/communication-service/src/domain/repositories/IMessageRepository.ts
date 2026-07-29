import { Message } from "../entities/Message";

export type NewMessage = Omit<Message, 'id'>;

export interface IMessageRepository {
  create(message: NewMessage): Promise<Message>;
  findByChatId(chatId: string, limit?: number, offset?: number): Promise<Message[]>;
  markAsRead(messageId: string): Promise<void>;
  markChatMessagesAsRead(chatId: string, userId: string): Promise<void>;
}
