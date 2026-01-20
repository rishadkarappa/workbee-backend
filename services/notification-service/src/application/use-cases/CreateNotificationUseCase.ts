import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import { ICreateNotificationUseCase } from "../ports/ICreateNotificationUseCase";

@injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(
    @inject("NotificationRepository")
    private repo: INotificationRepository
  ) {}

  async execute(data: Notification): Promise<Notification> {
    return this.repo.create({
      ...data,
      isRead: false,
      createdAt: new Date()
    });
  }
}
