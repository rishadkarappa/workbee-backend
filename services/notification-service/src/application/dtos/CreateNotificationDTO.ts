import { UserRole } from "workbee-common";

export type NotificationType =
  | "NEW_MESSAGE"
  | "WORK_UPDATE"
  | "BOOKING_UPDATE"
  | "PAYMENT";

export type SenderRole = UserRole.WORKER | UserRole.USER;

export interface NotificationDataDTO {
  chatId?: string;
  senderId?: string;
  senderName?: string;
  senderRole?: SenderRole;
  workId?: string;
  workerId?: string;
  progress?: "started" | "ongoing" | "completed";
}

export interface CreateNotificationDTO {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationDataDTO;
}
