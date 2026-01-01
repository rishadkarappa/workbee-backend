export interface Message {
  id?: string;
  chatId: string;
  senderId: string;
  senderRole: "user" | "worker";
  senderDetails?: {
    name: string;
    avatar?: string;
  };
  content: string;
  type: "text" | "image" | "file";
  isRead: boolean;
  createdAt?: Date;
}
