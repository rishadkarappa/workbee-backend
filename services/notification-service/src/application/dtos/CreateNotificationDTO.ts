export type NotificationType =
  | "NEW_MESSAGE"
  | "WORK_UPDATE"
  | "BOOKING_UPDATE"
  | "PAYMENT";

export type SenderRole = "user" | "worker";

export interface NotificationDataDTO {
  chatId?: string;
  senderId?: string;
  senderName?: string;
  senderRole?: SenderRole;
}

export interface CreateNotificationDTO {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationDataDTO;
}
