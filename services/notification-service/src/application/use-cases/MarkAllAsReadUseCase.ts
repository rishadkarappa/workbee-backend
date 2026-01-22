import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IMarkAllAsReadUseCase } from "../ports/IMarkAllAsReadUseCase";
import { MarkAllAsReadDTO } from "../dtos/MarkAllAsReadDTO";

@injectable()
export class MarkAllAsReadUseCase
  implements IMarkAllAsReadUseCase
{
  constructor(
    @inject("NotificationRepository")
    private notificationRepository: INotificationRepository
  ) {}

  async execute(dto: MarkAllAsReadDTO): Promise<boolean> {
    return await this.notificationRepository.markAllAsRead(dto.userId);
  }
}
