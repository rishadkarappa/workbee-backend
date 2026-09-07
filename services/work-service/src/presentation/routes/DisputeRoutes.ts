import { Router } from "express";
import { container } from "tsyringe";
import { DisputeController } from "../controllers/DisputeController";

const router = Router();
const disputeController = container.resolve(DisputeController);

router.get("/dispute/upload-signature", disputeController.getUploadSignature.bind(disputeController));
router.post("/dispute", disputeController.createDispute.bind(disputeController));
router.get("/dispute/my-disputes", disputeController.getMyDisputes.bind(disputeController));
router.get("/dispute/worker-disputes", disputeController.getWorkerDisputes.bind(disputeController));
router.get("/dispute/admin/all", disputeController.getAllDisputes.bind(disputeController));
router.get("/dispute/admin/:disputeId", disputeController.getDisputeById.bind(disputeController));
router.patch("/dispute/admin/:disputeId/action", disputeController.applyDisputeAction.bind(disputeController));

export default router;