import { Router } from "express";
import { container } from "tsyringe";
import { WorkerController } from "../../controllers/worker/WorkerController";

const router = Router();

const workerController = container.resolve(WorkerController);

router.post("/worker-login", workerController.workerLogin.bind(workerController));

export default router;