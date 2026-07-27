import { NextFunction, Request, Response } from "express";

export interface IUserController {
  register(req: Request, res: Response, next:NextFunction): Promise<void>;
  verifyOtp(req:Request, res:Response, next:NextFunction):Promise<void>;
  login(req:Request, res:Response, next:NextFunction):Promise<void>;
  verify(req:Request, res:Response, next:NextFunction):Promise<void>;
  googleLogin(req:Request, res:Response, next:NextFunction):Promise<void>;
  forgotPassword(req:Request, res:Response, next:NextFunction):Promise<void>;
  resetPassword(req:Request, res:Response, next:NextFunction):Promise<void>;
  refreshToken(req:Request, res:Response, next:NextFunction):Promise<void>;
  userLogout(req:Request, res:Response, next:NextFunction):Promise<void>;
}
