export interface INewMessageEvent {
  userId: string; // recipient user ID
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'worker';
  chatId: string;
  messageContent: string;
  timestamp: Date;
}