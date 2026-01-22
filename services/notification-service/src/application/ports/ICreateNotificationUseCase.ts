import { Notification } from "../../domain/entities/Notification";
import { CreateNotificationDTO } from "../dtos/CreateNotificationDTO";

export interface ICreateNotificationUseCase {
  execute(dto: CreateNotificationDTO): Promise<Notification>;
}