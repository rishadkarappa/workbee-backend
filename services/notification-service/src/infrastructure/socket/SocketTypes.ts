import { Socket } from 'socket.io';
import { UserRole } from 'workbee-common';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: UserRole;
}