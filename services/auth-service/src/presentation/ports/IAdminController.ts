import { NextFunction, Request, Response } from "express";

export interface IAdminContoller{
    adminLogin(req:Request, res:Response, next:NextFunction):Promise<void>;
    getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
}
