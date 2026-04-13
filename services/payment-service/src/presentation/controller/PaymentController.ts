import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { CreateRazorpayOrderUseCase } from "../../application/use-cases/CreateRazorpayOrderUseCase";
import { VerifyRazorpayPaymentUseCase } from "../../application/use-cases/VerifyRazorpayPaymentUseCase";
import { ScheduleWorkerPayoutUseCase } from "../../application/use-cases/ScheduleWorkerPayoutUseCase";
import { GetWalletUseCase } from "../../application/use-cases/GetWalletUseCase";
import { GetAdminPaymentSummaryUseCase } from "../../application/use-cases/GetAdminPaymentSummaryUseCase";
import { scheduleWorkerPayout } from "../../infrastructure/queue/PayoutQueue";
import { GetAdminPaymentsListUseCase } from "../../application/use-cases/GetAdminPaymentsListUseCase";

@injectable()
export class PaymentController {
  constructor(
    @inject("CreateRazorpayOrderUseCase") private createOrderUseCase: CreateRazorpayOrderUseCase,
    @inject("VerifyRazorpayPaymentUseCase") private verifyPaymentUseCase: VerifyRazorpayPaymentUseCase,
    @inject("ScheduleWorkerPayoutUseCase") private schedulePayoutUseCase: ScheduleWorkerPayoutUseCase,
    @inject("GetWalletUseCase") private getWalletUseCase: GetWalletUseCase,
    @inject("GetAdminPaymentSummaryUseCase") private adminSummaryUseCase: GetAdminPaymentSummaryUseCase,
    @inject("GetAdminPaymentsListUseCase") private adminPaymentsListUseCase: GetAdminPaymentsListUseCase,
  ) { }

  // POST /payment/create-order
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

      const result = await this.createOrderUseCase.execute({
        workId,
        userId,
        workerId,
        workTitle,
        amount: Number(amount),
      });

      res.status(200).json({
        success: true,
        data: {
          orderId: result.orderId,
          amount: result.amount,
          currency: result.currency,
          keyId: result.keyId,
          paymentId: result.payment.id,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /payment/verify
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

      const result = await this.verifyPaymentUseCase.execute({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      if (err.message === "Payment signature verification failed") {
        res.status(400).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  // POST /payment/work-completed
  async workCompleted(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workId } = req.body;

      if (!workId) {
        res.status(400).json({ success: false, message: "workId required" });
        return;
      }

      const result = await this.schedulePayoutUseCase.execute(workId);

      if (result) {
        await scheduleWorkerPayout(result.paymentId);
        res.status(200).json({ success: true, message: "Payout scheduled in 1 hour" });
      } else {
        res.status(200).json({ success: true, message: "No paid payment found for this work, skipped" });
      }
    } catch (err) {
      next(err);
    }
  }

  // GET /payment/wallet
  async getWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const data = await this.getWalletUseCase.execute(userId, userRole);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  // GET /payment/admin/summary
  async getAdminSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.headers["x-user-role"] as string;

      if (userRole !== "admin") {
        res.status(403).json({ success: false, message: "Forbidden" });
        return;
      }

      const data = await this.adminSummaryUseCase.execute();
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

      const data = await this.adminPaymentsListUseCase.execute(page, limit);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

}