
import { inject, injectable } from 'tsyringe';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';

@injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    @inject("NotificationRepository") private notificationRepository: INotificationRepository
  ) {}

  async execute(notificationId: string): Promise<boolean> {
    return await this.notificationRepository.markAsRead(notificationId);
  }
}
