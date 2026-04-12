import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { CreateCheckoutSessionUseCase } from "../../application/use-cases/CreateCheckoutSessionUseCase";
import { HandleStripeWebhookUseCase } from "../../application/use-cases/HandleStripeWebhookUseCase";
import { ScheduleWorkerPayoutUseCase } from "../../application/use-cases/ScheduleWorkerPayoutUseCase";
import { GetWalletUseCase } from "../../application/use-cases/GetWalletUseCase";
import { GetAdminPaymentSummaryUseCase } from "../../application/use-cases/GetAdminPaymentSummaryUseCase";

import { scheduleWorkerPayout } from "../../infrastructure/queue/PayoutQueue";

@injectable()
export class PaymentController {
  constructor(
    @inject(CreateCheckoutSessionUseCase)
    private createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,

    @inject(HandleStripeWebhookUseCase)
    private handleStripeWebhookUseCase: HandleStripeWebhookUseCase,

    @inject(ScheduleWorkerPayoutUseCase)
    private scheduleWorkerPayoutUseCase: ScheduleWorkerPayoutUseCase,

    @inject(GetWalletUseCase)
    private getWalletUseCase: GetWalletUseCase,

    @inject(GetAdminPaymentSummaryUseCase)
    private getAdminPaymentSummaryUseCase: GetAdminPaymentSummaryUseCase
  ) {}

  async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId || userRole !== "user") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { workId, workerId, workTitle, amount } = req.body;

      if (!workId || !workerId || !workTitle || !amount) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }

      const result = await this.createCheckoutSessionUseCase.execute({
        workId,
        userId,
        workerId,
        workTitle,
        amount: Number(amount)
      });

      return res.status(200).json({
        success: true,
        data: {
          sessionId: result.sessionId,
          sessionUrl: result.sessionUrl,
          paymentId: result.payment.id
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers["stripe-signature"] as string;

      await this.handleStripeWebhookUseCase.execute(
        req.body as Buffer,
        sig
      );

      return res.json({ received: true });
    } catch (err: any) {
      console.error("[Webhook] Error:", err.message);

      return res.status(400).json({
        error: err.message
      });
    }
  }

  async workCompleted(req: Request, res: Response, next: NextFunction) {
    try {
      const { workId } = req.body;

      if (!workId) {
        return res.status(400).json({
          success: false,
          message: "workId required"
        });
      }

      const result =
        await this.scheduleWorkerPayoutUseCase.execute(workId);

      if (result) {
        await scheduleWorkerPayout(result.paymentId);

        return res.status(200).json({
          success: true,
          message: "Payout scheduled in 1 hour"
        });
      }

      return res.status(200).json({
        success: true,
        message: "No payment found, skipped"
      });
    } catch (err) {
      next(err);
    }
  }

  async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const data = await this.getWalletUseCase.execute(
        userId,
        userRole
      );

      return res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getAdminSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.headers["x-user-role"] as string;

      if (userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }

      const data =
        await this.getAdminPaymentSummaryUseCase.execute();

      return res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }
}