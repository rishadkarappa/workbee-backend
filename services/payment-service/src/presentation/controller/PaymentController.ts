import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { HttpStatusCode, UserRole } from "workbee-common";

import { IPaymentController } from "../ports/IPaymentController";

import { ICreateRazorpayOrderUseCase } from "../../application/ports/user/ICreateRazorpayOrderUseCase";
import { IVerifyRazorpayPaymentUseCase } from "../../application/ports/payment/IVerifyRazorpayPaymentUseCase";
import { IScheduleWorkerPayoutUseCase } from "../../application/ports/worker/IScheduleWorkerPayoutUseCase";
import { IGetWalletUseCase } from "../../application/ports/wallet/IGetWalletUseCase";
import { IGetAdminPaymentSummaryUseCase } from "../../application/ports/admin/IGetAdminPaymentSummaryUseCase";
import { IGetAdminPaymentsListUseCase } from "../../application/ports/admin/IGetAdminPaymentsListUseCase";

import { scheduleWorkerPayout } from "../../infrastructure/queue/PayoutQueue";

import { ResponseHelper } from "../../shared/helpers/reponseHelper";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";
import { ErrorMessages } from "../../shared/constants/ErrorMessages";
import { IGetWorkerEarningsStatsUseCase } from "../../application/ports/worker/IGetWorkerEarningsStatsUseCase";
import { IGetAdminPaymentStatsUseCase } from "../../application/ports/admin/IGetAdminPaymentStatsUseCase";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject("CreateRazorpayOrderUseCase") private readonly _createOrderUseCase: ICreateRazorpayOrderUseCase,
    @inject("VerifyRazorpayPaymentUseCase") private readonly _verifyPaymentUseCase: IVerifyRazorpayPaymentUseCase,
    @inject("ScheduleWorkerPayoutUseCase") private readonly _schedulePayoutUseCase: IScheduleWorkerPayoutUseCase,
    @inject("GetWalletUseCase") private readonly _getWalletUseCase: IGetWalletUseCase,
    @inject("GetAdminPaymentSummaryUseCase") private readonly _adminSummaryUseCase: IGetAdminPaymentSummaryUseCase,
    @inject("GetAdminPaymentsListUseCase") private readonly _adminPaymentsListUseCase: IGetAdminPaymentsListUseCase,
    @inject("GetWorkerEarningsStatsUseCase") private readonly _getWorkerEarningsStatsUseCase: IGetWorkerEarningsStatsUseCase,
    @inject("GetAdminPaymentStatsUseCase") private readonly _getAdminPaymentStatsUseCase: IGetAdminPaymentStatsUseCase,

  ) { }

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId || userRole !== UserRole.USER) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED));
        return;
      }

      const { workId, workerId, workTitle, amount } = req.body;

      if (!workId || !workerId || !workTitle || !amount) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(ResponseHelper.error(ErrorMessages.PAYMENT.MISSING_REQUIRED_FIELDS, HttpStatusCode.BAD_REQUEST));
        return;
      }

      const result = await this._createOrderUseCase.execute({ workId, userId, workerId, workTitle, amount: Number(amount), });

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHelper.success(result, ResponseMessage.PAYMENT.CREATED_ORDER, HttpStatusCode.OK));
    } catch (err) {
      next(err);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId || userRole !== UserRole.USER) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json(ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED));
        return;
      }

      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, } = req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(ResponseHelper.error(ErrorMessages.PAYMENT.MISSING_PAYMENT_VERIFICATION_FIELDS, HttpStatusCode.BAD_REQUEST));
        return;
      }

      const result = await this._verifyPaymentUseCase.execute({ razorpayOrderId, razorpayPaymentId, razorpaySignature, });

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHelper.success(result, ResponseMessage.GENERAL.SUCCESS, HttpStatusCode.OK));
    } catch (err) {
      next(err);
    }
  }

  async workCompleted(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId || (userRole !== UserRole.WORKER && userRole !== UserRole.ADMIN)) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json(ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED));
        return;
      }

      const { workId } = req.body;

      if (!workId) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(ResponseHelper.error(ErrorMessages.PAYMENT.MISSING_WORK_ID, HttpStatusCode.BAD_REQUEST));
        return;
      }

      const result = await this._schedulePayoutUseCase.execute({ workId, });

      if (result.scheduled) {
        await scheduleWorkerPayout(result.paymentId!);

        res
          .status(HttpStatusCode.OK)
          .json(ResponseHelper.success(null, ResponseMessage.PAYMENT.PAYOUT_SCHEDULED, HttpStatusCode.OK));

        return;
      }

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHelper.success(null, ResponseMessage.PAYMENT.NO_PAID_PAYMENT, HttpStatusCode.OK));
    } catch (err) {
      next(err);
    }
  }

  async getWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json(ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED));
        return;
      }

      const data = await this._getWalletUseCase.execute({ ownerId: userId, role: userRole, });

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHelper.success(data, ResponseMessage.GENERAL.SUCCESS, HttpStatusCode.OK));
    } catch (err) {
      next(err);
    }
  }

  async getAdminSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.headers["x-user-role"] as string;

      if (userRole !== UserRole.ADMIN) {
        res
          .status(HttpStatusCode.FORBIDDEN)
          .json(ResponseHelper.error(ErrorMessages.AUTH.FORBIDDEN, HttpStatusCode.FORBIDDEN));
        return;
      }

      const data = await this._adminSummaryUseCase.execute();

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHelper.success(data, ResponseMessage.GENERAL.SUCCESS, HttpStatusCode.OK));
    } catch (err) {
      next(err);
    }
  }

  async getAdminPaymentsList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.headers["x-user-role"] as string;

      if (userRole !== UserRole.ADMIN) {
        res
          .status(HttpStatusCode.FORBIDDEN)
          .json(ResponseHelper.error(ErrorMessages.AUTH.FORBIDDEN, HttpStatusCode.FORBIDDEN));
        return;
      }

      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);

      const data = await this._adminPaymentsListUseCase.execute({ page, limit });

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHelper.success(data, ResponseMessage.GENERAL.SUCCESS, HttpStatusCode.OK));
    } catch (err) {
      next(err);
    }
  }

  async getWorkerEarningsStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId || userRole !== UserRole.WORKER) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED));
        return;
      }

      const data = await this._getWorkerEarningsStatsUseCase.execute(userId);

      res.status(HttpStatusCode.OK).json(ResponseHelper.success(data, ResponseMessage.GENERAL.SUCCESS, HttpStatusCode.OK));
    } catch (err) {
      next(err);
    }
  }

  // admin dash stati
  async getAdminPaymentStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.headers["x-user-role"] as string;

      if (userRole !== UserRole.ADMIN) {
        res
          .status(HttpStatusCode.FORBIDDEN)
          .json(ResponseHelper.error(ErrorMessages.AUTH.FORBIDDEN, HttpStatusCode.FORBIDDEN));
        return;
      }

      const data = await this._getAdminPaymentStatsUseCase.execute();

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHelper.success(data, ResponseMessage.GENERAL.SUCCESS, HttpStatusCode.OK));
    } catch (err) {
      next(err);
    }
  }
}