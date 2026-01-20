import { Notification } from "../../domain/entities/Notification";

export interface ICreateNotificationUseCase {
  execute(data: Notification): Promise<Notification>;
}
