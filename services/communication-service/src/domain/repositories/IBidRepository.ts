import { Bid } from '../entities/Bid';

export interface IBidRepository {
  create(bid: Bid): Promise<Bid>;
  findById(id: string): Promise<Bid | null>;
  /** Latest non-rejected bid for a work — null if none or the latest was rejected (so a fresh offer can start). */
  findActiveByWorkId(workId: string): Promise<Bid | null>;
  update(id: string, data: Partial<Bid>): Promise<Bid | null>;
}