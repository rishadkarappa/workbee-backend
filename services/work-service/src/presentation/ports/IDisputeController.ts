import { Request, Response, NextFunction } from "express";

export interface IDisputeController {
  getUploadSignature(req: Request, res: Response, next: NextFunction): Promise<void>;
  createDispute(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMyDisputes(req: Request, res: Response, next: NextFunction): Promise<void>;
  getWorkerDisputes(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllDisputes(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDisputeById(req: Request, res: Response, next: NextFunction): Promise<void>;
  applyDisputeAction(req: Request, res: Response, next: NextFunction): Promise<void>;
}