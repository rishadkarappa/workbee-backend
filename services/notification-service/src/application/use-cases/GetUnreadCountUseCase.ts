
import { inject, injectable } from 'tsyringe';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';


@injectable()
export class GetUnreadCountUseCase {
  constructor(
    @inject("NotificationRepository") private notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string): Promise<number> {
    return await this.notificationRepository.getUnreadCount(userId);
  }
}