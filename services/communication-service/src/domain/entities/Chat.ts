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
  createdAt?: Date;
  updatedAt?: Date;
}
