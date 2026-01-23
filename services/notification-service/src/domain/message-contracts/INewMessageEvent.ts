export type SenderRole = 'user' | 'worker';

export interface INewMessageEvent {
  userId: string;
  senderId: string;
  senderName: string;
  senderRole: SenderRole;
  chatId: string;
  messageContent: string;
  timestamp: Date;
}
