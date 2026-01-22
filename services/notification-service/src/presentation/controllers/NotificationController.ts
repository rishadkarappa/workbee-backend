import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { GetUserNotificationsUseCase } from '../../application/use-cases/GetUserNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '../../application/use-cases/MarkNotificationAsReadUseCase';
import { MarkAllAsReadUseCase } from '../../application/use-cases/MarkAllAsReadUseCase';
import { GetUnreadCountUseCase } from '../../application/use-cases/GetUnreadCountUseCase';

@injectable()
export class NotificationController {
  constructor(
    @inject("GetUserNotificationsUseCase") private getUserNotificationsUseCase: GetUserNotificationsUseCase,
    @inject("MarkNotificationAsReadUseCase") private markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    @inject("MarkAllAsReadUseCase") private markAllAsReadUseCase: MarkAllAsReadUseCase,
    @inject("GetUnreadCountUseCase") private getUnreadCountUseCase: GetUnreadCountUseCase
  ) {}

  async getNotifications(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { limit, offset } = req.query;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const notifications = await this.getUserNotificationsUseCase.execute(
        user.id,
        limit ? parseInt(limit as string) : 50,
        offset ? parseInt(offset as string) : 0
      );

      res.status(200).json({
        success: true,
        data: notifications,
        message: 'Notifications retrieved successfully'
      });
    } catch (error: any) {
      console.error('Get notifications error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { notificationId } = req.params;

      const result = await this.markNotificationAsReadUseCase.execute(notificationId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Notification marked as read'
      });
    } catch (error: any) {
      console.error('Mark as read error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const result = await this.markAllAsReadUseCase.execute(user.id);

      res.status(200).json({
        success: true,
        data: result,
        message: 'All notifications marked as read'
      });
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const count = await this.getUnreadCountUseCase.execute(user.id);

      res.status(200).json({
        success: true,
        data: { count },
        message: 'Unread count retrieved successfully'
      });
    } catch (error: any) {
      console.error('Get unread count error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
