// import { Request, Response } from 'express';
// import { inject, injectable } from 'tsyringe';
// import { CreateChatUseCase } from '../../application/use-cases/chat/CreateChatUseCase';
// import { GetUserChatsUseCase } from '../../application/use-cases/chat/GetUserChatsUseCase';
// import { GetMessagesUseCase } from '../../application/use-cases/chat/GetMessagesUseCase';
// import { HttpStatus } from '../../shared/enums/HttpStatus';
// import { ResponseHelper } from '../../shared/helpers/responseHelper';

// @injectable()
// export class ChatController {
//   constructor(
//     @inject(CreateChatUseCase) private createChatUseCase: CreateChatUseCase,
//     @inject(GetUserChatsUseCase) private getUserChatsUseCase: GetUserChatsUseCase,
//     @inject(GetMessagesUseCase) private getMessagesUseCase: GetMessagesUseCase
//   ) {}

//   async createChat(req: Request, res: Response) {
//     try {
//       const { userId, workerId } = req.body;
//       const chat = await this.createChatUseCase.execute({ userId, workerId });
//       res.status(HttpStatus.OK).json(ResponseHelper.success(chat, 'Chat created/retrieved successfully'));
//     } catch (error: any) {
//       res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
//     }
//   }

//   async getUserChats(req: Request, res: Response) {
//     try {
//       const user = (req as any).user; 
//       const chats = await this.getUserChatsUseCase.execute(user.id, user.role);
//       res.status(HttpStatus.OK).json(ResponseHelper.success(chats, 'Chats retrieved successfully'));
//     } catch (error: any) {
//       res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
//     }
//   }

//   async getMessages(req: Request, res: Response) {
//     try {
//       const { chatId } = req.params;
//       const { limit, offset } = req.query;

//       const messages = await this.getMessagesUseCase.execute({
//         chatId,
//         limit: limit ? parseInt(limit as string) : undefined,
//         offset: offset ? parseInt(offset as string) : undefined
//       });

//       res.status(HttpStatus.OK).json(ResponseHelper.success(messages, 'Messages retrieved successfully'));
//     } catch (error: any) {
//       res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
//     }
//   }
// }


// src/presentation/controllers/ChatController.ts
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

  async createChat(req: Request, res: Response) {
    try {
      const { userId, workerId } = req.body;
      console.log('Create chat request:', { userId, workerId });
      const chat = await this.createChatUseCase.execute({ userId, workerId });
      res.status(HttpStatus.OK).json(ResponseHelper.success(chat, 'Chat created/retrieved successfully'));
    } catch (error: any) {
      console.error('Create chat error:', error);
      res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST));
    }
  }

  async getUserChats(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      // ADD DETAILED LOGGING
      console.log('=== GET USER CHATS DEBUG ===');
      console.log('Full request user object:', user);
      console.log('User ID:', user?.id);
      console.log('User Role:', user?.role);
      console.log('Request headers:', req.headers);
      
      if (!user || !user.id || !user.role) {
        console.error('User authentication data missing!');
        return res.status(HttpStatus.UNAUTHORIZED).json(
          ResponseHelper.error('User not authenticated', HttpStatus.UNAUTHORIZED)
        );
      }
      
      const chats = await this.getUserChatsUseCase.execute(user.id, user.role);
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

      console.log('Get messages request:', { chatId, limit, offset });

      const messages = await this.getMessagesUseCase.execute({
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