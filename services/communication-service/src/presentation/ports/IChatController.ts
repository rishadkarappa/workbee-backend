import { Request, Response } from "express";

export interface IChatController {
  createChat(req: Request, res: Response): Promise<Response | void>;
  getUserChats(req: Request, res: Response): Promise<Response | void>;
  getMessages(req: Request, res: Response): Promise<Response | void>;
}
