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
  userRole?: "user" | "worker" | "admin";
}

export class SocketManager {
  private io: Server;
  private userSockets: Map<string, string> = new Map();
  private cacheService: CacheService;
  private messageEventPublisher: MessageEventPublisher;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
      }
    });

    this.cacheService = container.resolve(CacheService);
    this.messageEventPublisher = container.resolve(MessageEventPublisher);

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
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        socket.userId = decoded.id || decoded.userId;
        socket.userRole = decoded.role;
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User connected: ${socket.userId} (${socket.userRole})`);

      if (socket.userId) {
        this.userSockets.set(socket.userId, socket.id);
      }

      socket.join(`user:${socket.userId}`);

      socket.on('join_chat', (chatId: string) => {
        socket.join(`chat:${chatId}`);
        console.log(`User ${socket.userId} joined chat ${chatId}`);
      });

      socket.on('leave_chat', (chatId: string) => {
        socket.leave(`chat:${chatId}`);
        console.log(`User ${socket.userId} left chat ${chatId}`);
      });

      socket.on('send_message', async (data: {
        chatId: string;
        content: string;
        type?: 'text' | 'image' | 'file';
        recipientId?: string;
      }) => {
        try {
          if (!socket.userId || !socket.userRole) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          const sendMessageUseCase = container.resolve(SendMessageUseCase);

          const message = await sendMessageUseCase.execute({
            chatId: data.chatId,
            senderId: socket.userId,
            senderRole: socket.userRole as "user" | "worker",
            content: data.content,
            type: data.type
          });

          let senderProfile;
          if (socket.userRole === 'user') {
            senderProfile = await this.cacheService.getUserProfile(socket.userId);
          } else {
            senderProfile = await this.cacheService.getWorkerProfile(socket.userId);
          }

          const enrichedMessage = {
            ...message,
            // Always include chatId explicitly in the payload.
            // message entity has chatId but spreading may lose it depending
            // on serialization. Being explicit guarantees the frontend
            // can always read (message as any).chatId for badge updates.
            chatId: data.chatId,
            senderDetails: senderProfile ? {
              name: senderProfile.name,
              avatar: senderProfile.avatar
            } : undefined
          };

          // Emit to everyone who has this chat open (both sides if both have it open)
          this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

          // Also emit to the recipient's personal room.
          // The recipient is ALWAYS in user:${recipientId} from the moment they connect.
          // But they only join chat:${chatId} when they open that specific chat.
          // If the chat is not open, the above emit reaches nobody on their side
          // badge never increments → only shows after refresh.
          if (data.recipientId) {
            const recipientSocketId = this.userSockets.get(data.recipientId);
            if (recipientSocketId) {
              const recipientSocket = this.io.sockets.sockets.get(recipientSocketId);
              const isRecipientInChatRoom = recipientSocket?.rooms.has(`chat:${data.chatId}`);

              if (!isRecipientInChatRoom) {
                // Recipient doesn't have this chat open — send via personal room
                // so their handleNewMessage fires and increments the badge
                this.io.to(`user:${data.recipientId}`).emit('new_message', enrichedMessage);
              }
              // If they ARE in the chat room, they already got it from the emit above
            }
          }

          // Publish notification event to RabbitMQ
          if (data.recipientId && senderProfile) {
            await this.messageEventPublisher.publishNewMessage({
              userId: data.recipientId,
              senderId: socket.userId,
              senderName: senderProfile.name,
              senderRole: socket.userRole as 'user' | 'worker',
              chatId: data.chatId,
              messageContent: data.content,
              timestamp: new Date()
            });
          }

        } catch (error: any) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('typing', (data: { chatId: string; isTyping: boolean }) => {
        socket.to(`chat:${data.chatId}`).emit('user_typing', {
          userId: socket.userId,
          isTyping: data.isTyping
        });
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
        }
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