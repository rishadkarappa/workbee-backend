import { inject, injectable } from 'tsyringe';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';

@injectable()
export class GetUserNotificationsUseCase {
  constructor(
    @inject("NotificationRepository") private notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    return await this.notificationRepository.findByUserId(userId, limit, offset);
  }
}