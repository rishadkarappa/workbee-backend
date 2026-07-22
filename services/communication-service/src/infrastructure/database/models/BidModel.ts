import { Schema, model, Document } from 'mongoose';

const BidHistorySchema = new Schema(
  {
    amount: { type: Number, required: true },
    offeredBy: { type: String, enum: ['user', 'worker'], required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const BidSchema = new Schema(
  {
    chatId: { type: String, required: true, index: true },
    workId: { type: String, required: true, index: true },
    workTitle: { type: String, required: true },
    userId: { type: String, required: true },
    workerId: { type: String, required: true },
    workerName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    awaitingResponseFrom: { type: String, enum: ['user', 'worker'], required: true },
    lastOfferBy: { type: String, enum: ['user', 'worker'], required: true },
    history: { type: [BidHistorySchema], default: [] },
  },
  { timestamps: true }
);

export interface BidDocument extends Document {
  chatId: string;
  workId: string;
  workTitle: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  awaitingResponseFrom: 'user' | 'worker';
  lastOfferBy: 'user' | 'worker';
  history: { amount: number; offeredBy: 'user' | 'worker'; at: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

export const BidModel = model<BidDocument>('Bid', BidSchema);