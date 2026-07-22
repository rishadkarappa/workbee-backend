export type BidParty = 'user' | 'worker';
export type BidStatus = 'pending' | 'accepted' | 'rejected';

export interface BidHistoryItem {
  amount: number;
  offeredBy: BidParty;
  at: Date;
}

export interface Bid {
  id?: string;
  chatId: string;
  workId: string;
  workTitle: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  status: BidStatus;
  awaitingResponseFrom: BidParty;
  lastOfferBy: BidParty;
  history: BidHistoryItem[];
  createdAt?: Date;
  updatedAt?: Date;
}