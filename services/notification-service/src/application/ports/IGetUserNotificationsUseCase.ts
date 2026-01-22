import { Notification } from "../../domain/entities/Notification";
import { GetUserNotificationsDTO } from "../dtos/GetUserNotificationsDTO";

export interface IGetUserNotificationsUseCase {
  execute(dto: GetUserNotificationsDTO): Promise<Notification[]>;
}
