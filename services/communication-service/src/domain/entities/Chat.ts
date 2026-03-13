export interface Chat {
  id?: string;
  participants: {
    userId: string;
    workerId: string;
  };
  participantDetails?: {
    user?: {
      id: string;
      name: string;
      avatar?: string;
    };
    worker?: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: {
    userId: number;
    workerId: number;
  };
  myUnreadCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}