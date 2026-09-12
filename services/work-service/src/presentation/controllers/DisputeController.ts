import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { HttpStatus } from "../../shared/enums/HttpStatus";
import { ResponseHelper } from "../../shared/helpers/ResponseHelper";
import { ErrorMessages } from "../../shared/constants/ErrorMessages";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";
import { ENV } from "../../infrastructure/config/env";

import { CreateDisputeDto, ApplyDisputeActionDto, GetAllDisputesFilterDto } from "../../application/dtos/dispute/DisputeDTO";

import { ICreateDisputeUseCase } from "../../application/ports/dispute/ICreateDisputeUseCase";
import { IGetUserDisputesUseCase } from "../../application/ports/dispute/IGetUserDisputesUseCase";
import { IGetWorkerDisputesUseCase } from "../../application/ports/dispute/IGetWorkerDisputesUseCase";
import { IGetAllDisputesUseCase } from "../../application/ports/dispute/IGetAllDisputesUseCase";
import { IGetDisputeByIdUseCase } from "../../application/ports/dispute/IGetDisputeByIdUseCase";
import { IApplyDisputeActionUseCase } from "../../application/ports/dispute/IApplyDisputeActionUseCase";
import { ICloudinaryService } from "../../domain/services/ICloudinaryService";

import { IDisputeController } from "../ports/IDisputeController";

@injectable()
export class DisputeController implements IDisputeController {
  constructor(
    @inject("CreateDisputeUseCase") private readonly _createDisputeUseCase: ICreateDisputeUseCase,
    @inject("GetUserDisputesUseCase") private readonly _getUserDisputesUseCase: IGetUserDisputesUseCase,
    @inject("GetWorkerDisputesUseCase") private readonly _getWorkerDisputesUseCase: IGetWorkerDisputesUseCase,
    @inject("GetAllDisputesUseCase") private readonly _getAllDisputesUseCase: IGetAllDisputesUseCase,
    @inject("GetDisputeByIdUseCase") private readonly _getDisputeByIdUseCase: IGetDisputeByIdUseCase,
    @inject("ApplyDisputeActionUseCase") private readonly _applyDisputeActionUseCase: IApplyDisputeActionUseCase,
    @inject("CloudinaryService") private readonly _cloudinaryService: ICloudinaryService
  ) { }

  async getUploadSignature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json(ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED));
        return;
      }

      const resourceType = (req.query.resourceType as string) === "video" ? "video" : "image";
      const folder = `workbee/disputes/${userId}`;
      const { signature, timestamp } = this._cloudinaryService.generateUploadSignature({ folder });

      res.status(HttpStatus.OK).json(
        ResponseHelper.success(
          { signature, timestamp, apiKey: ENV.CLOUDINARY_API_KEY, cloudName: ENV.CLOUDINARY_CLOUD_NAME, folder, resourceType },
          ResponseMessage.DISPUTE.UPLOAD_SIGN_GENERATED
        )
      );
    } catch (err) {
      next(err);
    }
  }

  async createDispute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json(ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED));
        return;
      }

      const { workId, workerId, complaintType, description, proofImages, proofVideo } = req.body;
      const dto: CreateDisputeDto = { workId, workerId, userId, complaintType, description, proofImages, proofVideo };

      const result = await this._createDisputeUseCase.execute(dto);
      res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.DISPUTE.CREATED));
    } catch (err) {
      next(err);
    }
  }

  async getMyDisputes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json(ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED));
        return;
      }
      const result = await this._getUserDisputesUseCase.execute(userId);
      res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.DISPUTE.RETRIEVED));
    } catch (err) {
      next(err);
    }
  }

  async getWorkerDisputes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workerId = req.headers["x-user-id"] as string;
      if (!workerId) {
        res.status(HttpStatus.UNAUTHORIZED).json(ResponseHelper.error(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED));
        return;
      }
      const result = await this._getWorkerDisputesUseCase.execute(workerId);
      res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.DISPUTE.RETRIEVED));
    } catch (err) {
      next(err);
    }
  }

  async getAllDisputes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = (req.query.status as string) || "all";
      const actionTarget = ((req.query.actionTarget as string) || "all") as "all" | "worker" | "user";
      const search = (req.query.search as string) || "";

      const filters: GetAllDisputesFilterDto = { page, limit, status, actionTarget, search };
      const result = await this._getAllDisputesUseCase.execute(filters);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success(
          { disputes: result.disputes, total: result.total, page, limit, totalPages: Math.ceil(result.total / limit) },
          ResponseMessage.DISPUTE.RETRIEVED
        ));
    } catch (err) {
      next(err);
    }
  }

  async getDisputeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { disputeId } = req.params;
      if (typeof disputeId !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(ErrorMessages.DISPUTE.INVALID_DISPUTE_ID, HttpStatus.BAD_REQUEST));
        return;
      }
      const result = await this._getDisputeByIdUseCase.execute(disputeId);
      res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.DISPUTE.RETRIEVED));
    } catch (err) {
      next(err);
    }
  }

  async applyDisputeAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = (req.headers["x-user-id"] as string) || "admin";
      const { disputeId } = req.params;
      const { actionType, reason } = req.body;

      if (typeof disputeId !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json(ResponseHelper.error(ErrorMessages.DISPUTE.INVALID_DISPUTE_ID, HttpStatus.BAD_REQUEST));
        return;
      }

      const dto: ApplyDisputeActionDto = { disputeId, actionType, reason, adminId };
      const result = await this._applyDisputeActionUseCase.execute(dto);

      res.status(HttpStatus.OK).json(ResponseHelper.success(result, ResponseMessage.DISPUTE.ACTION_APPLIED));
    } catch (err) {
      next(err);
    }
  }
}