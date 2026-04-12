import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { CreateRazorpayOrderUseCase } from "../../application/use-cases/CreateRazorpayOrderUseCase";
import { VerifyRazorpayPaymentUseCase } from "../../application/use-cases/VerifyRazorpayPaymentUseCase";
import { ScheduleWorkerPayoutUseCase } from "../../application/use-cases/ScheduleWorkerPayoutUseCase";
import { GetWalletUseCase } from "../../application/use-cases/GetWalletUseCase";
import { GetAdminPaymentSummaryUseCase } from "../../application/use-cases/GetAdminPaymentSummaryUseCase";

import { scheduleWorkerPayout } from "../../infrastructure/queue/PayoutQueue";

@injectable()
export class PaymentController {
  constructor(
    @inject("CreateRazorpayOrderUseCase")
    private createRazorpayOrderUseCase: CreateRazorpayOrderUseCase,

    @inject("VerifyRazorpayPaymentUseCase")
    private verifyRazorpayPaymentUseCase: VerifyRazorpayPaymentUseCase,

    @inject("ScheduleWorkerPayoutUseCase")
    private scheduleWorkerPayoutUseCase: ScheduleWorkerPayoutUseCase,

    @inject("GetWalletUseCase")
    private getWalletUseCase: GetWalletUseCase,

    @inject("GetAdminPaymentSummaryUseCase")
    private getAdminPaymentSummaryUseCase: GetAdminPaymentSummaryUseCase
  ) {}

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId || userRole !== "user") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { workId, workerId, workTitle, amount } = req.body;

      const result = await this.createRazorpayOrderUseCase.execute({
        workId,
        userId,
        workerId,
        workTitle,
        amount: Number(amount),
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result =
        await this.verifyRazorpayPaymentUseCase.execute(req.body);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async workCompleted(req: Request, res: Response, next: NextFunction) {
    try {
      const { workId } = req.body;

      const result =
        await this.scheduleWorkerPayoutUseCase.execute(workId);

      if (result) {
        await scheduleWorkerPayout(result.paymentId);
      }

      return res.status(200).json({
        success: true,
        message: "Payout scheduled successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      const data = await this.getWalletUseCase.execute(
        userId,
        userRole
      );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdminSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await this.getAdminPaymentSummaryUseCase.execute();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}