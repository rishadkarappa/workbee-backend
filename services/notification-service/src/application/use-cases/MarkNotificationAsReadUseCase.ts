import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IMarkNotificationAsReadUseCase } from "../ports/IMarkNotificationAsReadUseCase";
import { MarkNotificationAsReadDTO } from "../dtos/MarkNotificationAsReadDTO";

@injectable()
export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase{
  constructor(
    @inject("NotificationRepository")
    private notificationRepository: INotificationRepository
  ) {}

  async execute(dto: MarkNotificationAsReadDTO): Promise<boolean> {
    return await this.notificationRepository.markAsRead(dto.notificationId);
  }
}
