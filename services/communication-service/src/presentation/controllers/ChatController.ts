import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CreateChatUseCase } from '../../application/use-cases/chat/CreateChatUseCase';
import { GetUserChatsUseCase } from '../../application/use-cases/chat/GetUserChatsUseCase';
import { GetMessagesUseCase } from '../../application/use-cases/chat/GetMessagesUseCase';
import { HttpStatus } from '../../shared/enums/HttpStatus';
import { ResponseHelper } from '../../shared/helpers/responseHelper';

@injectable()
export class ChatController {
  constructor(
    @inject(CreateChatUseCase) private createChatUseCase: CreateChatUseCase,
    @inject(GetUserChatsUseCase) private getUserChatsUseCase: GetUserChatsUseCase,
    @inject(GetMessagesUseCase) private getMessagesUseCase: GetMessagesUseCase
  ) {}

  // Create or get existing chat
  async createChat(req: Request, res: Response) {
    try {
      const { userId, workerId } = req.body;
      const chat = await this.createChatUseCase.execute({ userId, workerId });
      res.status(HttpStatus.OK).json(ResponseHelper.success(chat, 'Chat created/retrieved successfully'));
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }

  // Get all chats for a user
  async getUserChats(req: Request, res: Response) {
    try {
      const user = (req as any).user; // From JWT middleware
      const chats = await this.getUserChatsUseCase.execute(user.id, user.role);
      res.status(HttpStatus.OK).json(ResponseHelper.success(chats, 'Chats retrieved successfully'));
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }

  // Get messages for a chat
  async getMessages(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { limit, offset } = req.query;

      const messages = await this.getMessagesUseCase.execute({
        chatId,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });

      res.status(HttpStatus.OK).json(ResponseHelper.success(messages, 'Messages retrieved successfully'));
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }
}