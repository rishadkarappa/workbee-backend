import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { HttpStatus } from '../../shared/enums/HttpStatus';
import { ResponseHelper } from '../../shared/helpers/responseHelper';

import { IChatController } from '../ports/IChatController';
import { ICreateChatUseCase } from '../../application/ports/chat/ICreateChatUseCase';
import { IGetUserChatsUseCase } from '../../application/ports/chat/IGetUserChatsUseCase';
import { IGetMessagesUseCase } from '../../application/ports/chat/IGetMessagesUseCase';
import { MarkChatAsReadUseCase } from '../../application/use-cases/chat/MarkChatAsReadUseCase';
import { ResponseMessage } from '../../shared/constants/ResponseMessages';
import { ErrorMessages } from '../../shared/constants/ErrorMessages';

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject("CreateChatUseCase") private readonly _createChatUseCase: ICreateChatUseCase,
    @inject("GetUserChatsUseCase") private readonly _getUserChatsUseCase: IGetUserChatsUseCase,
    @inject("GetMessagesUseCase") private readonly _getMessagesUseCase: IGetMessagesUseCase,
    @inject("MarkChatAsReadUseCase") private readonly _markChatAsReadUseCase: MarkChatAsReadUseCase
  ) { }

  async createChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, workerId } = req.body;
      const chat = await this._createChatUseCase.execute({ userId, workerId });
      res.status(HttpStatus.OK).json(ResponseHelper.success(chat, ResponseMessage.CHAT.CHAT_CREATED));
    } catch (error) {
      next(error)
    }
  }

  async getUserChats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user || !user.id || !user.role) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          ResponseHelper.error(ErrorMessages.AUTH.USER_UNAUTHENTICATED, HttpStatus.UNAUTHORIZED)
        );
        return
      }

      const chats = await this._getUserChatsUseCase.execute({
        userId: user.id,
        role: user.role
      });

      res.status(HttpStatus.OK).json(ResponseHelper.success(chats, ResponseMessage.CHAT.CHAT_RETRIEVED));
    } catch (error) {
      next(error)
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { chatId } = req.params;
      const { limit, offset } = req.query;

      const messages = await this._getMessagesUseCase.execute({
        chatId,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined
      });

      res.status(HttpStatus.OK).json(ResponseHelper.success(messages, ResponseMessage.CHAT.MESSAGE_RETREIVED));
    } catch (error) {
      next(error)
    }
  }

  async markChatAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      const { chatId } = req.params;

      if (!user || !user.id || !user.role) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          ResponseHelper.error(ErrorMessages.AUTH.USER_UNAUTHENTICATED, HttpStatus.UNAUTHORIZED)
        );
        return
      }

      await this._markChatAsReadUseCase.execute({
        chatId,
        role: user.role
      });

      res.status(HttpStatus.OK).json(ResponseHelper.success(null, ResponseMessage.CHAT.MARKED_AS_READ));
    } catch (error) {
      next(error)
    }
  }
}