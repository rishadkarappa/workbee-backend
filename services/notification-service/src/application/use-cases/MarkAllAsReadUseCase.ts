import { inject, injectable } from 'tsyringe';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';

@injectable()
export class MarkAllAsReadUseCase {
  constructor(
    @inject("NotificationRepository") private notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string): Promise<boolean> {
    return await this.notificationRepository.markAllAsRead(userId);
  }
}