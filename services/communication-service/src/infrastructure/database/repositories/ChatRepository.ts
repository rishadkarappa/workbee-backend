import { injectable } from 'tsyringe';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { Chat } from '../../../domain/entities/Chat';
import { ChatModel } from '../models/ChatModel';

@injectable()
export class ChatRepository implements IChatRepository {

  async create(chat: Chat): Promise<Chat> {
    const newChat = await ChatModel.create(chat);
    return this.toEntity(newChat);
  }

  async findById(id: string): Promise<Chat | null> {
    const chat = await ChatModel.findById(id);
    return chat ? this.toEntity(chat) : null;
  }

  async findByParticipants(userId: string, workerId: string): Promise<Chat | null> {
    const chat = await ChatModel.findOne({
      'participants.userId': userId,
      'participants.workerId': workerId
    });
    return chat ? this.toEntity(chat) : null;
  }

  async findByUserId(userId: string): Promise<Chat[]> {
    const chats = await ChatModel.find({ 'participants.userId': userId })
      .sort({ lastMessageAt: -1 });
    return chats.map(chat => this.toEntity(chat));
  }

  async findByWorkerId(workerId: string): Promise<Chat[]> {
    const chats = await ChatModel.find({ 'participants.workerId': workerId })
      .sort({ lastMessageAt: -1 });
    return chats.map(chat => this.toEntity(chat));
  }

  async updateLastMessage(chatId: string, message: string): Promise<void> {
    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessage: message,
      lastMessageAt: new Date()
    });
  }

  async incrementUnreadCount(chatId: string, recipientRole: 'userId' | 'workerId'): Promise<void> {
    const field = `unreadCount.${recipientRole}`;
    await ChatModel.findByIdAndUpdate(chatId, { $inc: { [field]: 1 } });
  }

  async resetUnreadCount(chatId: string, readerRole: 'userId' | 'workerId'): Promise<void> {
    const field = `unreadCount.${readerRole}`;
    await ChatModel.findByIdAndUpdate(chatId, { $set: { [field]: 0 } });
  }

  private toEntity(doc: any): Chat {
    return {
      id: doc._id.toString(),
      participants: doc.participants,
      lastMessage: doc.lastMessage,
      lastMessageAt: doc.lastMessageAt,
      unreadCount: {
        userId:   doc.unreadCount?.userId   ?? 0,
        workerId: doc.unreadCount?.workerId ?? 0
      },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}