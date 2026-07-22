import { inject, injectable } from 'tsyringe';
import { IBidRepository } from '../../../domain/repositories/IBidRepository';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { IRespondToBidUseCase } from '../../ports/bid/IRespondToBidUseCase';
import { RespondToBidDTO, BidActionResult } from '../../dtos/bid/BidDTO';

@injectable()
export class RespondToBidUseCase implements IRespondToBidUseCase {
  constructor(
    @inject('BidRepository') private bidRepository: IBidRepository,
    @inject('MessageRepository') private messageRepository: IMessageRepository,
    @inject('ChatRepository') private chatRepository: IChatRepository
  ) {}

  async execute(data: RespondToBidDTO): Promise<BidActionResult> {
    const bid = await this.bidRepository.findById(data.bidId);
    if (!bid) throw new Error('Bid not found');
    if (bid.status !== 'pending') throw new Error('This negotiation has already been finalized');
    if (bid.awaitingResponseFrom !== data.respondedBy) {
      throw new Error('It is not your turn to respond');
    }

    const updated = await this.bidRepository.update(bid.id!, {
      status: data.action === 'accept' ? 'accepted' : 'rejected',
    });

    const payload = {
      type: data.action === 'accept' ? 'WORK_BID_ACCEPTED' : 'WORK_BID_REJECTED',
      bidId: bid.id,
      workId: bid.workId,
      workTitle: bid.workTitle,
      userId: bid.userId,
      workerId: bid.workerId,
      workerName: bid.workerName,
      amount: bid.amount,
      respondedBy: data.respondedBy,
    };

    const senderId = data.respondedBy === 'worker' ? bid.workerId : bid.userId;

    const message = await this.messageRepository.create({
      chatId: bid.chatId,
      senderId,
      senderRole: data.respondedBy,
      content: JSON.stringify(payload),
      type: 'system',
      isRead: false,
    });

    await this.chatRepository.updateLastMessage(
      bid.chatId,
      data.action === 'accept' ? `Offer of ₹${bid.amount} accepted` : `Offer of ₹${bid.amount} rejected`
    );

    return {
      bid: updated!,
      systemMessageContent: JSON.stringify({ ...payload, messageId: message.id }),
    };
  }
}