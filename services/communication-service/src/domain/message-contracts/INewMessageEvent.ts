import { UserRole } from "workbee-common";

export interface INewMessageEvent {
  userId: string; // recipient user ID
  senderId: string;
  senderName: string;
  senderRole: UserRole.USER | UserRole.WORKER;
  chatId: string;
  messageContent: string;
  timestamp: Date;
}