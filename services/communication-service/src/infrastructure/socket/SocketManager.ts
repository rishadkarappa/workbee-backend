// import { Server as HttpServer } from 'http';
// import { Server, Socket } from 'socket.io';
// import jwt from 'jsonwebtoken';
// import { container } from 'tsyringe';
// import { SendMessageUseCase } from '../../application/use-cases/chat/SendMessageUseCase';
// import { CacheService } from '../services/CacheService';
// import { MessageEventPublisher } from '../message-bus/MessageEventPublisher';

// const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233';

// interface AuthenticatedSocket extends Socket {
//   userId?: string;
//   userRole?: 'user' | 'worker' | 'admin';
// }

// // ─ Payload shape the client sends via send_message 
// interface SendMessagePayload {
//   chatId:       string;
//   content:      string;
//   type?:        'text' | 'image' | 'video' | 'file';
//   recipientId?: string;
//   mediaUrl?:      string;
//   mediaPublicId?: string;
// }

// export class SocketManager {
//   private io: Server;
//   private userSockets: Map<string, string> = new Map();
//   private cacheService: CacheService;
//   private messageEventPublisher: MessageEventPublisher;

//   constructor(httpServer: HttpServer) {
//     this.io = new Server(httpServer, {
//       cors: {
//         origin:      process.env.CORS_ORIGIN || 'http://localhost:5173',
//         credentials: true,
//         methods:     ['GET', 'POST'],
//       },
//     });

//     this.cacheService           = container.resolve(CacheService);
//     this.messageEventPublisher  = container.resolve(MessageEventPublisher);

//     this.setupMiddleware();
//     this.setupEventHandlers();
//   }

//   private setupMiddleware() {
//     this.io.use((socket: AuthenticatedSocket, next) => {
//       const token = socket.handshake.auth.token;

//       if (!token) {
//         return next(new Error('Authentication error: No token provided'));
//       }

//       try {
//         const decoded    = jwt.verify(token, JWT_SECRET) as any;
//         socket.userId    = decoded.id || decoded.userId;
//         socket.userRole  = decoded.role;
//         next();
//       } catch {
//         next(new Error('Authentication error: Invalid token'));
//       }
//     });
//   }

//   private setupEventHandlers() {
//     this.io.on('connection', (socket: AuthenticatedSocket) => {
//       console.log(`[Socket] connected: ${socket.userId} (${socket.userRole})`);

//       if (socket.userId) {
//         this.userSockets.set(socket.userId, socket.id);
//       }

//       // Each user always joins their personal room on connect
//       socket.join(`user:${socket.userId}`);

//       // ─ join / leave chat room 
//       socket.on('join_chat', (chatId: string) => {
//         socket.join(`chat:${chatId}`);
//         console.log(`[Socket] ${socket.userId} joined chat:${chatId}`);
//       });

//       socket.on('leave_chat', (chatId: string) => {
//         socket.leave(`chat:${chatId}`);
//       });

//       // ─ send_message 
//       socket.on('send_message', async (data: SendMessagePayload) => {
//         try {
//           if (!socket.userId || !socket.userRole) {
//             socket.emit('error', { message: 'User not authenticated' });
//             return;
//           }

//           const sendMessageUseCase = container.resolve(SendMessageUseCase);

//           const savedMessage = await sendMessageUseCase.execute({
//             chatId:        data.chatId,
//             senderId:      socket.userId,
//             senderRole:    socket.userRole as 'user' | 'worker',
//             content:       data.content,
//             type:          data.type,
//             mediaUrl:      data.mediaUrl,
//             mediaPublicId: data.mediaPublicId,
//           });

//           // Enrich with sender profile
//           let senderProfile;
//           if (socket.userRole === 'user') {
//             senderProfile = await this.cacheService.getUserProfile(socket.userId);
//           } else {
//             senderProfile = await this.cacheService.getWorkerProfile(socket.userId);
//           }

//           const enrichedMessage = {
//             ...savedMessage,
//             // Always include chatId explicitly so frontend badge logic can read it
//             chatId: data.chatId,
//             senderDetails: senderProfile
//               ? { name: senderProfile.name, avatar: senderProfile.avatar }
//               : undefined,
//           };

//           // - broadcast to chat room (both sides if both have chat open)
//           this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

//           // - personal room delivery for badge updates 
//           if (data.recipientId) {
//             const recipientSocketId = this.userSockets.get(data.recipientId);
//             if (recipientSocketId) {
//               const recipientSocket    = this.io.sockets.sockets.get(recipientSocketId);
//               const isInChatRoom       = recipientSocket?.rooms.has(`chat:${data.chatId}`);

//               if (!isInChatRoom) {
//                 // Recipient has a different chat open (or none) — push via personal room
//                 this.io.to(`user:${data.recipientId}`).emit('new_message', enrichedMessage);
//               }
//               // If already in room — already received from the room emit above
//             }
//           }

//           // ─ RabbitMQ notification 
//           if (data.recipientId && senderProfile) {
//             const previewContent =
//               data.type === 'image' ? '📷 Image'
//               : data.type === 'video' ? '🎥 Video'
//               : data.content;

//             await this.messageEventPublisher.publishNewMessage({
//               userId:         data.recipientId,
//               senderId:       socket.userId,
//               senderName:     senderProfile.name,
//               senderRole:     socket.userRole as 'user' | 'worker',
//               chatId:         data.chatId,
//               messageContent: previewContent,
//               timestamp:      new Date(),
//             });
//           }
//         } catch (error: any) {
//           console.error('[Socket] send_message error:', error);
//           socket.emit('error', { message: error.message });
//         }
//       });

//       // - typing indicator
//       socket.on('typing', (data: { chatId: string; isTyping: boolean }) => {
//         socket.to(`chat:${data.chatId}`).emit('user_typing', {
//           userId:   socket.userId,
//           isTyping: data.isTyping,
//         });
//       });

//       // - disconnect
//       socket.on('disconnect', () => {
//         console.log(`[Socket] disconnected: ${socket.userId}`);
//         if (socket.userId) this.userSockets.delete(socket.userId);
//       });
//     });
//   }

//   public emitNotificationToUser(userId: string, notification: any) {
//     this.io.to(`user:${userId}`).emit('new_notification', notification);
//   }

//   public getIO(): Server {
//     return this.io;
//   }
// }

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';
import { SendMessageUseCase } from '../../application/use-cases/chat/SendMessageUseCase';
import { CacheService } from '../services/CacheService';
import { MessageEventPublisher } from '../message-bus/MessageEventPublisher';

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: 'user' | 'worker' | 'admin';
}

// ─ Payload shape the client sends via send_message
interface SendMessagePayload {
  chatId:       string;
  content:      string;
  type?:        'text' | 'image' | 'video' | 'file';
  recipientId?: string;
  mediaUrl?:      string;
  mediaPublicId?: string;
}

// ─ New payload shapes for work confirmation flow
interface AskForConfirmPayload {
  chatId:     string;
  workId:     string;
  workTitle:  string;
  workerId:   string;
  workerName: string;
  userId:     string;
}

interface ConfirmResponsePayload {
  chatId:     string;
  workId:     string;
  workTitle:  string;
  accepted:   boolean;
  userId:     string;
  workerName: string;
  workerId?:  string;
}

interface WorkProgressUpdatePayload {
  chatId:    string;
  workId:    string;
  workTitle: string;
  progress:  string;
  workerId:  string;
}

export class SocketManager {
  private io: Server;
  private userSockets: Map<string, string> = new Map();
  private cacheService: CacheService;
  private messageEventPublisher: MessageEventPublisher;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin:      process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
        methods:     ['GET', 'POST'],
      },
    });

    this.cacheService           = container.resolve(CacheService);
    this.messageEventPublisher  = container.resolve(MessageEventPublisher);

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use((socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded    = jwt.verify(token, JWT_SECRET) as any;
        socket.userId    = decoded.id || decoded.userId;
        socket.userRole  = decoded.role;
        next();
      } catch {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`[Socket] connected: ${socket.userId} (${socket.userRole})`);

      if (socket.userId) {
        this.userSockets.set(socket.userId, socket.id);
      }

      // Each user always joins their personal room on connect
      socket.join(`user:${socket.userId}`);

      // ─ join / leave chat room
      socket.on('join_chat', (chatId: string) => {
        socket.join(`chat:${chatId}`);
        console.log(`[Socket] ${socket.userId} joined chat:${chatId}`);
      });

      socket.on('leave_chat', (chatId: string) => {
        socket.leave(`chat:${chatId}`);
      });

      // ─ send_message
      socket.on('send_message', async (data: SendMessagePayload) => {
        try {
          if (!socket.userId || !socket.userRole) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          const sendMessageUseCase = container.resolve(SendMessageUseCase);

          const savedMessage = await sendMessageUseCase.execute({
            chatId:        data.chatId,
            senderId:      socket.userId,
            senderRole:    socket.userRole as 'user' | 'worker',
            content:       data.content,
            type:          data.type,
            mediaUrl:      data.mediaUrl,
            mediaPublicId: data.mediaPublicId,
          });

          // Enrich with sender profile
          let senderProfile;
          if (socket.userRole === 'user') {
            senderProfile = await this.cacheService.getUserProfile(socket.userId);
          } else {
            senderProfile = await this.cacheService.getWorkerProfile(socket.userId);
          }

          const enrichedMessage = {
            ...savedMessage,
            chatId: data.chatId,
            senderDetails: senderProfile
              ? { name: senderProfile.name, avatar: senderProfile.avatar }
              : undefined,
          };

          // Broadcast to chat room (both sides)
          this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

          // Personal room delivery for badge updates
          if (data.recipientId) {
            const recipientSocketId = this.userSockets.get(data.recipientId);
            if (recipientSocketId) {
              const recipientSocket = this.io.sockets.sockets.get(recipientSocketId);
              const isInChatRoom    = recipientSocket?.rooms.has(`chat:${data.chatId}`);

              if (!isInChatRoom) {
                this.io.to(`user:${data.recipientId}`).emit('new_message', enrichedMessage);
              }
            }
          }

          // RabbitMQ notification
          if (data.recipientId && senderProfile) {
            const previewContent =
              data.type === 'image' ? '📷 Image'
              : data.type === 'video' ? '🎥 Video'
              : data.content;

            await this.messageEventPublisher.publishNewMessage({
              userId:         data.recipientId,
              senderId:       socket.userId,
              senderName:     senderProfile.name,
              senderRole:     socket.userRole as 'user' | 'worker',
              chatId:         data.chatId,
              messageContent: previewContent,
              timestamp:      new Date(),
            });
          }
        } catch (error: any) {
          console.error('[Socket] send_message error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // ─ ask_for_confirm (worker → user: request to confirm the deal)
      socket.on('ask_for_confirm', async (data: AskForConfirmPayload) => {
        try {
          if (!socket.userId || !socket.userRole) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          console.log(`[Socket] ask_for_confirm from worker:${data.workerId} for work:${data.workId}`);

          const sendMessageUseCase = container.resolve(SendMessageUseCase);

          const savedMessage = await sendMessageUseCase.execute({
            chatId:     data.chatId,
            senderId:   data.workerId,
            senderRole: 'worker',
            content:    JSON.stringify({
              type:       'WORK_CONFIRM_REQUEST',
              workId:     data.workId,
              workTitle:  data.workTitle,
              workerName: data.workerName,
            }),
            type: 'system',
          });

          const enrichedMessage = {
            ...savedMessage,
            chatId: data.chatId,
          };

          // Broadcast to entire chat room — both worker and user see the card
          this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

          // Also push to user's personal room in case they don't have the chat open
          this.io.to(`user:${data.userId}`).emit('new_message', enrichedMessage);

        } catch (error: any) {
          console.error('[Socket] ask_for_confirm error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // ─ confirm_response (user → both: accept or reject the deal)
      socket.on('confirm_response', async (data: ConfirmResponsePayload) => {
        try {
          if (!socket.userId || !socket.userRole) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          console.log(`[Socket] confirm_response for work:${data.workId} accepted:${data.accepted}`);

          const sendMessageUseCase = container.resolve(SendMessageUseCase);

          const content = data.accepted
            ? JSON.stringify({
                type:      'WORK_CONFIRM_ACCEPTED',
                workId:    data.workId,
                workTitle: data.workTitle,
              })
            : JSON.stringify({
                type:      'WORK_CONFIRM_REJECTED',
                workId:    data.workId,
                workTitle: data.workTitle,
              });

          const savedMessage = await sendMessageUseCase.execute({
            chatId:     data.chatId,
            senderId:   data.userId,
            senderRole: 'user',
            content,
            type: 'system',
          });

          const enrichedMessage = {
            ...savedMessage,
            chatId: data.chatId,
          };

          // Broadcast to entire chat room
          this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

          // Push to worker's personal room as well
          if (data.workerId) {
            this.io.to(`user:${data.workerId}`).emit('new_message', enrichedMessage);
          }

        } catch (error: any) {
          console.error('[Socket] confirm_response error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // ─ work_progress_update (worker → both: update work progress)
      socket.on('work_progress_update', async (data: WorkProgressUpdatePayload) => {
        try {
          if (!socket.userId || !socket.userRole) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          console.log(`[Socket] work_progress_update work:${data.workId} progress:${data.progress}`);

          const sendMessageUseCase = container.resolve(SendMessageUseCase);

          const savedMessage = await sendMessageUseCase.execute({
            chatId:     data.chatId,
            senderId:   data.workerId,
            senderRole: 'worker',
            content:    JSON.stringify({
              type:      'WORK_PROGRESS_UPDATE',
              workId:    data.workId,
              workTitle: data.workTitle,
              progress:  data.progress,
            }),
            type: 'system',
          });

          const enrichedMessage = {
            ...savedMessage,
            chatId: data.chatId,
          };

          // 1. Broadcast system message to chat room (both see it in chat)
          this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

          // 2. Dedicated progress event — LiveWorks page listens to this
          //    for instant UI update without needing chat open
          this.io.to(`chat:${data.chatId}`).emit('work_progress_changed', {
            workId:   data.workId,
            progress: data.progress,
          });

        } catch (error: any) {
          console.error('[Socket] work_progress_update error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // ─ typing indicator
      socket.on('typing', (data: { chatId: string; isTyping: boolean }) => {
        socket.to(`chat:${data.chatId}`).emit('user_typing', {
          userId:   socket.userId,
          isTyping: data.isTyping,
        });
      });

      // ─ disconnect
      socket.on('disconnect', () => {
        console.log(`[Socket] disconnected: ${socket.userId}`);
        if (socket.userId) this.userSockets.delete(socket.userId);
      });
    });
  }

  public emitNotificationToUser(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('new_notification', notification);
  }

  public getIO(): Server {
    return this.io;
  }
}