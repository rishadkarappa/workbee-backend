import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from 'workbee-common';
import { Notification } from '../../domain/entities/Notification';
import { ENV } from '../config/env';

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export class SocketManager {
  private io: Server;
  private userSockets: Map<string, string> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: ENV.CORS_ORIGIN,
        credentials: true,
        methods: ["GET", "POST"]
      }
    });

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
        const decoded = jwt.verify(token, JWT_SECRET) as IJwtPayload;
        socket.userId = decoded.id || decoded.userId;
        socket.userRole = decoded.role;
        next();
      } catch (error) {
        console.log(error);
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`[Notification] User connected: ${socket.userId}`);

      if (socket.userId) {
        this.userSockets.set(socket.userId, socket.id);
        // Join user-specific room for targeted notifications
        socket.join(`user:${socket.userId}`);
      }

      socket.on('disconnect', () => {
        console.log(`[Notification] User disconnected: ${socket.userId}`);
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
        }
      });
    });
  }

  // Emit notification to specific user
  public emitNotificationToUser(userId: string, notification: Notification): void {
    console.log(`Emitting notification to user: ${userId}`);
    this.io.to(`user:${userId}`).emit('new_notification', notification);
  }

  // Broadcast to all connected clients (if needed)
  public broadcast(event: string, data: Notification): void {
    this.io.emit(event, data);
  }

  public getIO(): Server {
    return this.io;
  }

  public isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}