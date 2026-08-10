import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { IPaymentController } from "../ports/IPaymentController";
import { ICreateRazorpayOrderUseCase } from "../../application/ports/user/ICreateRazorpayOrderUseCase";
import { IVerifyRazorpayPaymentUseCase } from "../../application/ports/payment/IVerifyRazorpayPaymentUseCase";
import { IScheduleWorkerPayoutUseCase } from "../../application/ports/worker/IScheduleWorkerPayoutUseCase";
import { IGetWalletUseCase } from "../../application/ports/wallet/IGetWalletUseCase";
import { IGetAdminPaymentSummaryUseCase } from "../../application/ports/admin/IGetAdminPaymentSummaryUseCase";
import { IGetAdminPaymentsListUseCase } from "../../application/ports/admin/IGetAdminPaymentsListUseCase";
import { scheduleWorkerPayout } from "../../infrastructure/queue/PayoutQueue";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject("CreateRazorpayOrderUseCase") private readonly _createOrderUseCase: ICreateRazorpayOrderUseCase,
    @inject("VerifyRazorpayPaymentUseCase") private readonly _verifyPaymentUseCase: IVerifyRazorpayPaymentUseCase,
    @inject("ScheduleWorkerPayoutUseCase") private readonly _schedulePayoutUseCase: IScheduleWorkerPayoutUseCase,
    @inject("GetWalletUseCase") private readonly _getWalletUseCase: IGetWalletUseCase,
    @inject("GetAdminPaymentSummaryUseCase") private readonly _adminSummaryUseCase: IGetAdminPaymentSummaryUseCase,
    @inject("GetAdminPaymentsListUseCase") private readonly _adminPaymentsListUseCase: IGetAdminPaymentsListUseCase,
  ) { }

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;
      if (!userId || userRole !== "user") {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { workId, workerId, workTitle, amount } = req.body;
      if (!workId || !workerId || !workTitle || !amount) {
        res.status(400).json({ success: false, message: "Missing required fields: workId, workerId, workTitle, amount" });
        return;
      }

      const result = await this._createOrderUseCase.execute({
        workId, userId, workerId, workTitle, amount: Number(amount),
      });

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;
      if (!userId || userRole !== "user") {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        res.status(400).json({ success: false, message: "Missing payment verification fields" });
        return;
      }

      const result = await this._verifyPaymentUseCase.execute({
        razorpayOrderId, razorpayPaymentId, razorpaySignature,
      });

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async workCompleted(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;
      if (!userId || (userRole !== "worker" && userRole !== "admin")) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { workId } = req.body;
      if (!workId) {
        res.status(400).json({ success: false, message: "workId required" });
        return;
      }

      const result = await this._schedulePayoutUseCase.execute({ workId });
      if (result.scheduled) {
        await scheduleWorkerPayout(result.paymentId!);
        res.status(200).json({ success: true, message: "Payout scheduled in 1 hour" });
      } else {
        res.status(200).json({ success: true, message: "No paid payment found, skipped" });
      }

    } catch (err) {
      next(err);
    }
  }

  async getWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const data = await this._getWalletUseCase.execute({ ownerId: userId, role: userRole });
      res.status(200).json({ success: true, data });

    } catch (err) {
      next(err);
    }
  }

  async getAdminSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.headers["x-user-role"] as string;
      if (userRole !== "admin") {
        res.status(403).json({ success: false, message: "Forbidden" });
        return;
      }

      const data = await this._adminSummaryUseCase.execute();
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getAdminPaymentsList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.headers["x-user-role"] as string;
      if (userRole !== "admin") {
        res.status(403).json({ success: false, message: "Forbidden" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const data = await this._adminPaymentsListUseCase.execute({ page, limit });
      res.status(200).json({ success: true, data });
      
    } catch (err) {
      next(err);
    }
  }
}