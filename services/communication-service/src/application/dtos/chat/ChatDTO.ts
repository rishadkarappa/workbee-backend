export interface CreateChatDTO {
  userId: string;
  workerId: string;
}

export interface SendMessageDTO {
  chatId:      string;
  senderId:    string;
  senderRole:  'user' | 'worker';
  content:     string;
  type?:       'text' | 'image' | 'video' | 'file';
  // uploads to Cloudinary
  mediaUrl?:      string;
  mediaPublicId?: string;
  recipientId?:   string;
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

export interface MarkChatAsReadDTO {
  chatId: string;
  role: "user" | "worker";
}
