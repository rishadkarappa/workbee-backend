import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IMarkNotificationAsReadUseCase } from "../ports/IMarkNotificationAsReadUseCase";
import { MarkNotificationAsReadDTO } from "../dtos/MarkNotificationAsReadDTO";

@injectable()
export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase{
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(dto: MarkNotificationAsReadDTO): Promise<boolean> {
    return await this._notificationRepository.markAsRead(dto.notificationId);
  }
}
