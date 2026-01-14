export interface CreateChatDTO {
  userId: string;
  workerId: string;
}

export interface SendMessageDTO {
  chatId: string;
  senderId: string;
  senderRole: "user" | "worker";
  content: string;
  type?: "text" | "image" | "file";
}

export interface GetMessagesDTO {
  chatId: string;
  limit?: number;
  offset?: number;
}

export interface GetUserChatsDTO {
  userId: string;
  role: "user" | "worker";
}