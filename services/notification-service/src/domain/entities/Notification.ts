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
    senderRole?: 'user' | 'worker';
  };
  isRead: boolean;
  createdAt: Date;
}
