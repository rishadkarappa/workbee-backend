import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import { IGetUserNotificationsUseCase } from "../ports/IGetUserNotificationsUseCase";
import { GetUserNotificationsDTO } from "../dtos/GetUserNotificationsDTO";

@injectable()
export class GetUserNotificationsUseCase
  implements IGetUserNotificationsUseCase
{
  constructor(
    @inject("NotificationRepository") private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(dto: GetUserNotificationsDTO): Promise<Notification[]> {
    const {
      userId,
      limit = 50,
      offset = 0
    } = dto;

    return await this._notificationRepository.findByUserId(
      userId,
      limit,
      offset
    );
  }
}
