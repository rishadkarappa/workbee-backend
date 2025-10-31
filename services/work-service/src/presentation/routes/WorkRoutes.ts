import { Router } from "express";
import { WorkController } from "../controllers/WorkController";
import { container } from "tsyringe";

const router = Router();
const workController = container.resolve(WorkController)

router.post("/apply-worker", workController.applyWorker.bind(workController))
router.get("/get-new-appliers", workController.getNewAppliers.bind(workController))
router.post("/approve-worker", workController.approveWorker.bind(workController))
router.get("/get-workers", workController.getWorkers.bind(workController))
router.get("/post-work", workController.postWork.bind(workController))

export default router
