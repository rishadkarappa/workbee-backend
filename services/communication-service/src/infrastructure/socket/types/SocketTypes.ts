import { Socket } from 'socket.io';
import { UserRole } from 'workbee-common';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: UserRole;
}

export interface SendMessagePayload {
  chatId: string;
  content: string;
  type?: 'text' | 'image' | 'video' | 'file';
  recipientId?: string;
  mediaUrl?: string;
  mediaPublicId?: string;
}

export interface AskForConfirmPayload {
  chatId: string;
  workId: string;
  workTitle: string;
  workerId: string;
  workerName: string;
  userId: string;
}

export interface ConfirmResponsePayload {
  chatId: string;
  workId: string;
  workTitle: string;
  accepted: boolean;
  userId: string;
  workerName: string;
  workerId?: string;
}

export interface WorkProgressUpdatePayload {
  chatId: string;
  workId: string;
  workTitle: string;
  progress: string;
  workerId: string;
  userId: string;
}

export interface SendBidOfferPayload {
  chatId: string;
  workId: string;
  workTitle: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  offeredBy: UserRole.USER | UserRole.WORKER;
}

export interface RespondBidPayload {
  bidId: string;
  respondedBy: UserRole.USER | UserRole.WORKER;
  action: 'accept' | 'reject';
}

export interface BidPaymentCompletedPayload {
  chatId: string;
  bidId: string;
  workId: string;
  workTitle: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
}