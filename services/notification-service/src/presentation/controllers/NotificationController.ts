import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetUserNotificationsUseCase } from "../../application/ports/IGetUserNotificationsUseCase";
import { IMarkNotificationAsReadUseCase } from "../../application/ports/IMarkNotificationAsReadUseCase";
import { IMarkAllAsReadUseCase } from "../../application/ports/IMarkAllAsReadUseCase";
import { IGetUnreadCountUseCase } from "../../application/ports/IGetUnreadCountUseCase";

import { GetUserNotificationsDTO } from "../../application/dtos/GetUserNotificationsDTO";
import { MarkNotificationAsReadDTO } from "../../application/dtos/MarkNotificationAsReadDTO";
import { MarkAllAsReadDTO } from "../../application/dtos/MarkAllAsReadDTO";
import { GetUnreadCountDTO } from "../../application/dtos/GetUnreadCountDTO";

@injectable()
export class NotificationController {
  constructor(
    @inject("GetUserNotificationsUseCase")
    private _getUserNotificationsUseCase: IGetUserNotificationsUseCase,

    @inject("MarkNotificationAsReadUseCase")
    private _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,

    @inject("MarkAllAsReadUseCase")
    private _markAllAsReadUseCase: IMarkAllAsReadUseCase,

    @inject("GetUnreadCountUseCase")
    private _getUnreadCountUseCase: IGetUnreadCountUseCase
  ) {}

  async getNotifications(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { limit, offset } = req.query;

      if (!user?.id) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated"
        });
      }

      const dto: GetUserNotificationsDTO = {
        userId: user.id,
        limit: limit ? parseInt(limit as string, 10) : 50,
        offset: offset ? parseInt(offset as string, 10) : 0
      };

      const notifications =
        await this._getUserNotificationsUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: notifications,
        message: "Notifications retrieved successfully"
      });
    } catch (error: any) {
      console.error("Get notifications error:", error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      let { notificationId } = req.params;

      if (Array.isArray(notificationId)) {
        notificationId = notificationId[0];
      }

      const dto: MarkNotificationAsReadDTO = { notificationId };

      const result =
        await this._markNotificationAsReadUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: result,
        message: "Notification marked as read"
      });
    } catch (error: any) {
      console.error("Mark as read error:", error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated"
        });
      }

      const dto: MarkAllAsReadDTO = { userId: user.id };

      const result =
        await this._markAllAsReadUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: result,
        message: "All notifications marked as read"
      });
    } catch (error: any) {
      console.error("Mark all as read error:", error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated"
        });
      }

      const dto: GetUnreadCountDTO = { userId: user.id };

      const count =
        await this._getUnreadCountUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: { count },
        message: "Unread count retrieved successfully"
      });
    } catch (error: any) {
      console.error("Get unread count error:", error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
