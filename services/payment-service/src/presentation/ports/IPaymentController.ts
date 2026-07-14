import { NextFunction, Request, Response } from "express";

export interface IPaymentController {
    createOrder(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    verifyPayment(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    workCompleted(req: Request, res: Response, next:NextFunction) : Promise<Response | void>;
    getWallet(req: Request, res : Response,next:NextFunction) : Promise<Response | void>
    getAdminSummary(req: Request, res : Response, next:NextFunction) : Promise<Response | void>
    getAdminPaymentsList(req: Request, res: Response, next:NextFunction) : Promise<Response | void>
}