import { Notification } from '../entities/Notification';

export interface INotificationRepository {
  create(notification: Omit<Notification, 'id'>): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string, limit?: number, offset?: number): Promise<Notification[]>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  getUnreadCount(userId: string): Promise<number>;
}