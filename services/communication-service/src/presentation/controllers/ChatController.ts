import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { HttpStatus } from '../../shared/enums/HttpStatus';
import { ResponseHelper } from '../../shared/helpers/responseHelper';

import { IChatController } from '../ports/IChatController';

import { ICreateChatUseCase } from '../../application/ports/chat/ICreateChatUseCase';
import { IGetUserChatsUseCase } from '../../application/ports/chat/IGetUserChatsUseCase';
import { IGetMessagesUseCase } from '../../application/ports/chat/IGetMessagesUseCase';

@injectable()
export class ChatController implements IChatController{
  constructor(
    @inject("CreateChatUseCase") private _createChatUseCase: ICreateChatUseCase,
    @inject("GetUserChatsUseCase") private _getUserChatsUseCase: IGetUserChatsUseCase,
    @inject("GetMessagesUseCase") private _getMessagesUseCase: IGetMessagesUseCase
  ) { }

  async createChat(req: Request, res: Response) {
    try {
      const { userId, workerId } = req.body;
      console.log('Create chat request:', { userId, workerId });
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

      // console.log(user);
      // console.log("userid",user?.id);
      // console.log('userrole', user?.role);
      // console.log('head', req.headers);

      if (!user || !user.id || !user.role) {
        console.error('User authentication data missing!');
        return res.status(HttpStatus.UNAUTHORIZED).json(
          ResponseHelper.error('User not authenticated', HttpStatus.UNAUTHORIZED)
        );
      }

      // const chats = await this.getUserChatsUseCase.execute(user.id, user.role);
      const chats = await this._getUserChatsUseCase.execute({
        userId: user.id,
        role: user.role
      });
      console.log('Chats retrieved:', chats.length);
      res.status(HttpStatus.OK).json(ResponseHelper.success(chats, 'Chats retrieved successfully'));
    } catch (error: any) {
      console.error('Get user chats error:', error.message);
      console.error('Error stack:', error.stack);
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { limit, offset } = req.query;

      console.log('get msg in getmes',{ chatId, limit, offset });

      const messages = await this._getMessagesUseCase.execute({
        chatId,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });

      res.status(HttpStatus.OK).json(ResponseHelper.success(messages, 'Messages retrieved successfully'));
    } catch (error: any) {
      console.error('Get messages error:', error);
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }
}