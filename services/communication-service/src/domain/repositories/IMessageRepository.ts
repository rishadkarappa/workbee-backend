import { Message } from "../entities/Message";

export interface IMessageRepository {
  create(message: Message): Promise<Message>;
  findByChatId(chatId: string, limit?: number, offset?: number): Promise<Message[]>;
  markAsRead(messageId: string): Promise<void>;
  markChatMessagesAsRead(chatId: string, userId: string): Promise<void>;
}