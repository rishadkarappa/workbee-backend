import { UserRole } from "workbee-common";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: UserRole.USER | UserRole.USER;
  content: string;
  type: 'text' | 'image' | 'video' | 'file'| 'system';
  mediaUrl?: string;
  mediaPublicId?: string;
  isRead: boolean;
  createdAt?: Date;
  senderDetails?: {
    name: string;
    avatar?: string;
  };
}



