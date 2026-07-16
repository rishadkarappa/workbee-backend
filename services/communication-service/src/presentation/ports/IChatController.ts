import { NextFunction, Request, Response } from "express";

export interface IChatController {
  createChat(req: Request, res: Response, next:NextFunction): Promise<Response | void>;
  getUserChats(req: Request, res: Response, next:NextFunction): Promise<Response | void>;
  getMessages(req: Request, res: Response, next:NextFunction): Promise<Response | void>;
}
