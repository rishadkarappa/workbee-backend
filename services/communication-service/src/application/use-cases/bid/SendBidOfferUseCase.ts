import { inject, injectable } from 'tsyringe';
import { IBidRepository } from '../../../domain/repositories/IBidRepository';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';
import { ISendBidOfferUseCase } from '../../ports/bid/ISendBidOfferUseCase';
import { SendBidOfferDTO, BidActionResult } from '../../dtos/bid/BidDTO';

@injectable()
export class SendBidOfferUseCase implements ISendBidOfferUseCase {
  constructor(
    @inject('BidRepository') private bidRepository: IBidRepository,
    @inject('MessageRepository') private messageRepository: IMessageRepository,
    @inject('ChatRepository') private chatRepository: IChatRepository
  ) {}

  async execute(data: SendBidOfferDTO): Promise<BidActionResult> {
    if (!data.amount || data.amount <= 0) {
      throw new Error('Offer amount must be greater than zero');
    }

    const existing = await this.bidRepository.findActiveByWorkId(data.workId);

    let bid;

    if (!existing) {
      // No live bid — only the worker may open a negotiation.
      if (data.offeredBy !== 'worker') {
        throw new Error('Only the worker can make the first offer');
      }

      bid = await this.bidRepository.create({
        chatId: data.chatId,
        workId: data.workId,
        workTitle: data.workTitle,
        userId: data.userId,
        workerId: data.workerId,
        workerName: data.workerName,
        amount: data.amount,
        status: 'pending',
        awaitingResponseFrom: 'user',
        lastOfferBy: 'worker',
        history: [{ amount: data.amount, offeredBy: 'worker', at: new Date() }],
      });
    } else {
      if (existing.status !== 'pending') {
        throw new Error('This negotiation has already been finalized');
      }
      if (existing.awaitingResponseFrom !== data.offeredBy) {
        throw new Error('It is not your turn to make an offer');
      }

      // Only ONE counter offer is allowed total (i.e. history length must be exactly 1 here).
      if (existing.history.length >= 2) {
        throw new Error('Only one counter offer is allowed');
      }

      const nextAwaiting = data.offeredBy === 'user' ? 'worker' : 'user';

      const updated = await this.bidRepository.update(existing.id!, {
        amount: data.amount,
        lastOfferBy: data.offeredBy,
        awaitingResponseFrom: nextAwaiting,
        history: [...existing.history, { amount: data.amount, offeredBy: data.offeredBy, at: new Date() }],
      });
      bid = updated!;
    }

    const isCounter = bid.history.length > 1;

    const payload = {
      type: isCounter ? 'WORK_BID_COUNTER' : 'WORK_BID_OFFER',
      bidId: bid.id,
      workId: bid.workId,
      workTitle: bid.workTitle,
      userId: bid.userId,
      workerId: bid.workerId,
      workerName: bid.workerName,
      amount: bid.amount,
      offeredBy: data.offeredBy,
    };

    const systemMessageContent = JSON.stringify(payload);

    const senderId = data.offeredBy === 'worker' ? bid.workerId : bid.userId;
    const senderRole = data.offeredBy;

    const message = await this.messageRepository.create({
      chatId: data.chatId,
      senderId,
      senderRole,
      content: systemMessageContent,
      type: 'system',
      isRead: false,
    });

    await this.chatRepository.updateLastMessage(
      data.chatId,
      isCounter ? `Countered with ₹${bid.amount}` : `Offered ₹${bid.amount}`
    );

    return { bid, systemMessageContent: JSON.stringify({ ...JSON.parse(systemMessageContent), messageId: message.id }) };
  }
}