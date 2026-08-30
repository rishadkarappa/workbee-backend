import { UserRole } from "workbee-common";

export interface Notification {
  id: string;
  userId: string;
  type: 'NEW_MESSAGE' | 'WORK_UPDATE' | 'BOOKING_UPDATE' | 'PAYMENT';
  title: string;
  message: string;

  data?: {
    chatId?: string;

    senderId?: string;
    senderName?: string;
    senderRole?: "USER" | "WORKER";

    workId?: string;
    workerId?: string;
    progress?: "started" | "ongoing" | "completed";
  };

  isRead: boolean;
  createdAt: Date;
}
