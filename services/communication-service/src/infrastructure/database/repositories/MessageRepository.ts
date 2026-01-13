import { injectable } from 'tsyringe';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { Message } from '../../../domain/entities/Message';
import { MessageModel } from '../../database/models/MessageModel';

@injectable()
export class MessageRepository implements IMessageRepository {
  
  async create(message: Message): Promise<Message> {
    const newMessage = await MessageModel.create(message);
    return this.toEntity(newMessage);
  }

  async findByChatId(chatId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    const messages = await MessageModel.find({ chatId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(offset);
    return messages.map(msg => this.toEntity(msg));
  }

  async markAsRead(messageId: string): Promise<void> {
    await MessageModel.findByIdAndUpdate(messageId, { isRead: true });
  }

  async markChatMessagesAsRead(chatId: string, userId: string): Promise<void> {
    await MessageModel.updateMany(
      { chatId, senderId: { $ne: userId }, isRead: false },
      { isRead: true }
    );
  }

  private toEntity(doc: any): Message {
    return {
      id: doc._id.toString(),
      chatId: doc.chatId,
      senderId: doc.senderId,
      senderRole: doc.senderRole,
      content: doc.content,
      type: doc.type,
      isRead: doc.isRead,
      createdAt: doc.createdAt
    };
  }
}