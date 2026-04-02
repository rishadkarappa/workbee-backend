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
  // NEW — present only for image / video messages
  mediaUrl?:      string;
  mediaPublicId?: string;
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
            // Always include chatId explicitly so frontend badge logic can read it
            chatId: data.chatId,
            senderDetails: senderProfile
              ? { name: senderProfile.name, avatar: senderProfile.avatar }
              : undefined,
          };

          // - broadcast to chat room (both sides if both have chat open)
          this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

          // - personal room delivery for badge updates 
          if (data.recipientId) {
            const recipientSocketId = this.userSockets.get(data.recipientId);
            if (recipientSocketId) {
              const recipientSocket    = this.io.sockets.sockets.get(recipientSocketId);
              const isInChatRoom       = recipientSocket?.rooms.has(`chat:${data.chatId}`);

              if (!isInChatRoom) {
                // Recipient has a different chat open (or none) — push via personal room
                this.io.to(`user:${data.recipientId}`).emit('new_message', enrichedMessage);
              }
              // If already in room — already received from the room emit above
            }
          }

          // ─ RabbitMQ notification 
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

      // - typing indicator
      socket.on('typing', (data: { chatId: string; isTyping: boolean }) => {
        socket.to(`chat:${data.chatId}`).emit('user_typing', {
          userId:   socket.userId,
          isTyping: data.isTyping,
        });
      });

      // - disconnect
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