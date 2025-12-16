// import { Request, Response } from "express";

// export interface IUserController {
//   register(req: Request, res: Response): Promise<void>;
//   verifyOtp(req: Request, res: Response): Promise<void>;
//   login(req: Request, res: Response): Promise<void>;
//   verify(req: Request, res: Response): Promise<void>;
//   googleLogin(req: Request, res: Response): Promise<void>;
//   forgotPassword(req: Request, res: Response): Promise<void>;
//   resetPassword(req: Request, res: Response): Promise<void>;
//   // refreshToken(req: Request, res: Response): Promise<void>;
//   // userLogout(req: Request, res: Response): Promise<void>;
// }

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
