import { Request, Response } from "express";

export interface IAdminContoller{
    adminLogin(req:Request, res:Response):Promise<void>;
    getUsers(req:Request, res:Response):Promise<void>
}
