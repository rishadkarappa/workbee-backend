import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IGetUnreadCountUseCase } from "../ports/IGetUnreadCountUseCase";
import { GetUnreadCountDTO } from "../dtos/GetUnreadCountDTO";

@injectable()
export class GetUnreadCountUseCase implements IGetUnreadCountUseCase{
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(dto: GetUnreadCountDTO): Promise<number> {
    return await this._notificationRepository.getUnreadCount(dto.userId);
  }
}
