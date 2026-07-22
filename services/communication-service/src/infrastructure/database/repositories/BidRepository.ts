import { injectable } from 'tsyringe';
import { IBidRepository } from '../../../domain/repositories/IBidRepository';
import { Bid } from '../../../domain/entities/Bid';
import { BidModel } from '../../database/models/BidModel';

@injectable()
export class BidRepository implements IBidRepository {
  async create(bid: Bid): Promise<Bid> {
    const created = await BidModel.create(bid);
    return this.toEntity(created);
  }

  async findById(id: string): Promise<Bid | null> {
    const bid = await BidModel.findById(id);
    return bid ? this.toEntity(bid) : null;
  }

  async findActiveByWorkId(workId: string): Promise<Bid | null> {
    // Excludes rejected bids — once rejected, a fresh worker offer can start again.
    const bid = await BidModel.findOne({ workId, status: { $ne: 'rejected' } }).sort({
      createdAt: -1,
    });
    return bid ? this.toEntity(bid) : null;
  }

  async update(id: string, data: Partial<Bid>): Promise<Bid | null> {
    const updated = await BidModel.findByIdAndUpdate(id, data, { new: true });
    return updated ? this.toEntity(updated) : null;
  }

  private toEntity(doc: any): Bid {
    return {
      id: doc._id.toString(),
      chatId: doc.chatId,
      workId: doc.workId,
      workTitle: doc.workTitle,
      userId: doc.userId,
      workerId: doc.workerId,
      workerName: doc.workerName,
      amount: doc.amount,
      status: doc.status,
      awaitingResponseFrom: doc.awaitingResponseFrom,
      lastOfferBy: doc.lastOfferBy,
      history: doc.history,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}