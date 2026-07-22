import { SendBidOfferDTO, BidActionResult } from '../../dtos/bid/BidDTO';

export interface ISendBidOfferUseCase {
  execute(data: SendBidOfferDTO): Promise<BidActionResult>;
}