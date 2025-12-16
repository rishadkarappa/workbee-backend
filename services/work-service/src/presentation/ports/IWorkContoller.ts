import { Request, Response, NextFunction } from "express";

export interface IWorkController {
    applyWorker(req: Request, res: Response, next: NextFunction): Promise<void>;
    getNewAppliers(req: Request, res: Response, next: NextFunction): Promise<void>;
    approveWorker(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWorkers(req: Request, res: Response, next: NextFunction): Promise<void>;
    postWork(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllWorks(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockWorker(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyWorks(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateWork(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteMyWork(req: Request, res: Response, next: NextFunction): Promise<void>;
}