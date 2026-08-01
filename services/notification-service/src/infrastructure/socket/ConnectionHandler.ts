import { logger } from "../config/logger";
import { AuthenticatedSocket } from "./SocketTypes";

export class ConnectionHandler {
  private userSockets: Map<string, string>;

  constructor(userSockets: Map<string, string>) {
    this.userSockets = userSockets;
  }

  public register(socket: AuthenticatedSocket): void {
    logger.info(`[Notification] User connected: ${socket.userId}`);

    if (socket.userId) {
      this.userSockets.set(socket.userId, socket.id);
      socket.join(`user:${socket.userId}`);
    }

    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  private handleDisconnect(socket: AuthenticatedSocket): void {
    logger.info(`[Notification] User disconnected: ${socket.userId}`);
    if (socket.userId) {
      this.userSockets.delete(socket.userId);
    }
  }
}