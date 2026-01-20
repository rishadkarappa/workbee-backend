import { injectable } from 'tsyringe';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { Notification } from '../../../domain/entities/Notification';
import { NotificationModel } from '../models/NotificationModel';

@injectable()
export class NotificationRepository implements INotificationRepository {
  async create(notification: Omit<Notification, 'id'>): Promise<Notification> {
    const doc = await NotificationModel.create(notification);
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<Notification | null> {
    const doc = await NotificationModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByUserId(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    const docs = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
    return docs.map(doc => this.toEntity(doc));
  }

  async markAsRead(id: string): Promise<boolean> {
    const result = await NotificationModel.updateOne(
      { _id: id },
      { isRead: true, readAt: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await NotificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await NotificationModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({ userId, isRead: false });
  }

  private toEntity(doc: any): Notification {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      type: doc.type,
      title: doc.title,
      message: doc.message,
      data: doc.data,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
    };
  }
}