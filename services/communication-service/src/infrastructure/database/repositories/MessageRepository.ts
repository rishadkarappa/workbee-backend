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

  
  async findByChatId(chatId: string, limit?: number, offset?: number): Promise<Message[]> {
    let query = MessageModel.find({ chatId }).sort({ createdAt: 1 });

    if (offset !== undefined && offset > 0) {
      query = query.skip(offset);
    }

    if (limit !== undefined && limit > 0) {
      query = query.limit(limit);
    }

    const messages = await query;
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