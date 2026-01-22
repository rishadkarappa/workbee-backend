import { inject, injectable } from 'tsyringe';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';

export interface CreateNotificationDTO {
  userId: string;
  type: 'NEW_MESSAGE' | 'WORK_UPDATE' | 'BOOKING_UPDATE' | 'PAYMENT';
  title: string;
  message: string;
  data?: {
    chatId?: string;
    senderId?: string;
    senderName?: string;
    senderRole?: 'user' | 'worker';
  };
}

@injectable()
export class CreateNotificationUseCase {
  constructor(
    @inject("NotificationRepository") private notificationRepository: INotificationRepository
  ) {}

  async execute(dto: CreateNotificationDTO): Promise<Notification> {
    const notification: Omit<Notification, 'id'> = {
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      data: dto.data,
      isRead: false,
      createdAt: new Date()
    };

    return await this.notificationRepository.create(notification);
  }
}