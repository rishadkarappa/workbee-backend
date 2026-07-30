import { UserRole } from 'workbee-common';

export interface SendBidOfferDTO {
  chatId: string;
  workId: string;
  workTitle: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  offeredBy: UserRole.USER | UserRole.WORKER;
}

export interface RespondToBidDTO {
  bidId: string;
  respondedBy: UserRole.USER | UserRole.WORKER;
  action: 'accept' | 'reject';
}

export interface BidActionResult {
  bid: import('../../../domain/entities/Bid').Bid;
  systemMessageContent: string; // JSON string to persist as Message.content
}