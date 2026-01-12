import { Router } from "express";
import { WorkController } from "../controllers/WorkController";
import { container } from "tsyringe";
import multer from "multer";

const router = Router();
const workController = container.resolve(WorkController)

const upload = multer({ storage: multer.memoryStorage() });

router.post("/apply-worker", workController.applyWorker.bind(workController))
router.get("/get-new-appliers", workController.getNewAppliers.bind(workController))
router.post("/approve-worker", workController.approveWorker.bind(workController))
router.get("/get-workers", workController.getWorkers.bind(workController))
router.get("/get-all-works", workController.getAllWorks.bind(workController))
router.post("/post-work",
    upload.fields([
        { name: 'voiceFile', maxCount: 1 },
        { name: 'videoFile', maxCount: 1 },
        { name: 'beforeImage', maxCount: 1 }]),workController.postWork.bind(workController));

router.patch('/block-worker/:id', workController.blockWorker.bind(workController))
router.get('/get-my-works', workController.getMyWorks.bind(workController));
router.put('/update-work/:workId', workController.updateWork.bind(workController))
router.delete('/delete-my-work/:workId', workController.deleteMyWork.bind(workController))

// inter ser comm
// router.get('/workers/:workerId', workController.getWorkerProfile.bind(workController));
// router.post('/workers/batch', workController.getWorkerProfilesBatch.bind(workController));

export default router
