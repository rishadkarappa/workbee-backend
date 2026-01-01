import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';
import { SendMessageUseCase } from '../../application/use-cases/chat/SendMessageUseCase';
import { CacheService } from '../services/CacheService';

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: "user" | "worker" | "admin";
}

export class SocketManager {
  private io: Server;
  private userSockets: Map<string, string> = new Map();
  private cacheService: CacheService;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
      }
    });

    this.cacheService = new CacheService();
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
      }) => {
        try {
          const sendMessageUseCase = container.resolve(SendMessageUseCase);

          const message = await sendMessageUseCase.execute({
            chatId: data.chatId,
            senderId: socket.userId!,
            senderRole: socket.userRole as "user" | "worker",
            content: data.content,
            type: data.type
          });

          // Fetch sender details
          let senderProfile;
          if (socket.userRole === 'user') {
            senderProfile = await this.cacheService.getUserProfile(socket.userId!);
          } else {
            senderProfile = await this.cacheService.getWorkerProfile(socket.userId!);
          }

          const enrichedMessage = {
            ...message,
            senderDetails: senderProfile ? {
              name: senderProfile.name,
              avatar: senderProfile.avatar
            } : undefined
          };

          this.io.to(`chat:${data.chatId}`).emit('new_message', enrichedMessage);

        } catch (error: any) {
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

  public getIO(): Server {
    return this.io;
  }
}
