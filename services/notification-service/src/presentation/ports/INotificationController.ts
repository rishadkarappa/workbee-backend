import { NextFunction, Request, Response } from "express"

export interface INotificationController {
    getNotifications(req:Request, res:Response, next:NextFunction):Promise<void>;
    markAllAsRead(req:Request, res:Response, next:NextFunction):Promise<void>;
    markAsRead(req:Request, res:Response, next:NextFunction):Promise<void>;
    getUnreadCount(req:Request, res:Response, next:NextFunction):Promise<void>;
}