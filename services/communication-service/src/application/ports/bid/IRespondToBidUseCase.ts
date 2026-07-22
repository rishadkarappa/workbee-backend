import { RespondToBidDTO, BidActionResult } from '../../dtos/bid/BidDTO';

export interface IRespondToBidUseCase {
  execute(data: RespondToBidDTO): Promise<BidActionResult>;
}
