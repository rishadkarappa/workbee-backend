import { UserRole } from "workbee-common";

export interface INewMessageEvent {
  userId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole.USER | UserRole.WORKER;
  chatId: string;
  messageContent: string;
  timestamp: Date;
}
