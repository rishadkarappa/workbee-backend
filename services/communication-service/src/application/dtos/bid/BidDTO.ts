export interface SendBidOfferDTO {
  chatId: string;
  workId: string;
  workTitle: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  offeredBy: 'user' | 'worker';
}

export interface RespondToBidDTO {
  bidId: string;
  respondedBy: 'user' | 'worker';
  action: 'accept' | 'reject';
}

export interface BidActionResult {
  bid: import('../../../domain/entities/Bid').Bid;
  systemMessageContent: string; // JSON string to persist as Message.content
}