import { Request, Response } from "express";

export interface IWorkerController {
  workerLogin(req: Request, res: Response): Promise<void>;
}
