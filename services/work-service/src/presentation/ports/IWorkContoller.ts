import { Request, Response } from "express";

export interface IWorkController {
    applyWorker(req: Request, res: Response): Promise<void>;
    getNewAppliers(req: Request, res: Response): Promise<void>;
    approveWorker(req: Request, res: Response): Promise<void>;
    getWorkers(req: Request, res: Response): Promise<void>;
    postWork(req: Request, res: Response): Promise<void>;
    getAllWorks(req: Request, res: Response): Promise<void>;
    // getMyWorks(req: Request, res:Response):Promise<void>;
}
