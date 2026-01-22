import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import { ICreateNotificationUseCase } from "../ports/ICreateNotificationUseCase";
import { CreateNotificationDTO } from "../dtos/CreateNotificationDTO";

@injectable()
export class CreateNotificationUseCase
  implements ICreateNotificationUseCase
{
  constructor(
    @inject("NotificationRepository")
    private notificationRepository: INotificationRepository
  ) {}

  async execute(dto: CreateNotificationDTO): Promise<Notification> {
    const notification: Omit<Notification, "id"> = {
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
