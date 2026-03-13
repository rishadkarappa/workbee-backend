import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { HttpStatus } from '../../shared/enums/HttpStatus';
import { ResponseHelper } from '../../shared/helpers/responseHelper';

import { IChatController } from '../ports/IChatController';
import { ICreateChatUseCase } from '../../application/ports/chat/ICreateChatUseCase';
import { IGetUserChatsUseCase } from '../../application/ports/chat/IGetUserChatsUseCase';
import { IGetMessagesUseCase } from '../../application/ports/chat/IGetMessagesUseCase';
import { MarkChatAsReadUseCase } from '../../application/use-cases/chat/MarkChatAsReadUseCase';

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject("CreateChatUseCase")     private _createChatUseCase: ICreateChatUseCase,
    @inject("GetUserChatsUseCase")   private _getUserChatsUseCase: IGetUserChatsUseCase,
    @inject("GetMessagesUseCase")    private _getMessagesUseCase: IGetMessagesUseCase,
    @inject("MarkChatAsReadUseCase") private _markChatAsReadUseCase: MarkChatAsReadUseCase
  ) {}

  async createChat(req: Request, res: Response) {
    try {
      const { userId, workerId } = req.body;
      const chat = await this._createChatUseCase.execute({ userId, workerId });
      res.status(HttpStatus.OK).json(ResponseHelper.success(chat, 'Chat created/retrieved successfully'));
    } catch (error: any) {
      console.error('Create chat error:', error);
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }

  async getUserChats(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id || !user.role) {
        return res.status(HttpStatus.UNAUTHORIZED).json(
          ResponseHelper.error('User not authenticated', HttpStatus.UNAUTHORIZED)
        );
      }

      const chats = await this._getUserChatsUseCase.execute({
        userId: user.id,
        role: user.role
      });

      res.status(HttpStatus.OK).json(ResponseHelper.success(chats, 'Chats retrieved successfully'));
    } catch (error: any) {
      console.error('Get user chats error:', error.message);
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { limit, offset } = req.query;

      const messages = await this._getMessagesUseCase.execute({
        chatId,
        limit:  limit  ? parseInt(limit  as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined
      });

      res.status(HttpStatus.OK).json(ResponseHelper.success(messages, 'Messages retrieved successfully'));
    } catch (error: any) {
      console.error('Get messages error:', error);
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }

  async markChatAsRead(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { chatId } = req.params;

      if (!user || !user.id || !user.role) {
        return res.status(HttpStatus.UNAUTHORIZED).json(
          ResponseHelper.error('User not authenticated', HttpStatus.UNAUTHORIZED)
        );
      }

      await this._markChatAsReadUseCase.execute({
        chatId,
        role: user.role
      });

      res.status(HttpStatus.OK).json(ResponseHelper.success(null, 'Chat marked as read'));
    } catch (error: any) {
      console.error('Mark chat as read error:', error);
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }
}