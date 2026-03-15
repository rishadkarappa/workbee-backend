export interface Message {
  id?: string;
  chatId: string;
  senderId: string;
  senderRole: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  // set for image/video messages
  mediaUrl?: string;
  mediaPublicId?: string;
  isRead: boolean;
  createdAt?: Date;
  senderDetails?: {
    name: string;
    avatar?: string;
  };
}



