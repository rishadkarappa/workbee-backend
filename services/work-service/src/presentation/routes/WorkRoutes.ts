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
        { name: 'beforeImage', maxCount: 1 }]), workController.postWork.bind(workController));

router.patch('/block-worker/:id', workController.blockWorker.bind(workController))
router.get('/get-my-works', workController.getMyWorks.bind(workController));
router.put('/update-work/:workId', workController.updateWork.bind(workController))
router.delete('/delete-my-work/:workId', workController.deleteMyWork.bind(workController))


// inter ser comm (http)
router.get('/get-worker-profile/:workerId', workController.getWorkerProfile.bind(workController));
router.post('/get-worker-profile/batch', workController.getWorkerProfilesBatch.bind(workController));

router.get('/worker-assigned-works', workController.getWorkerAssignedWorks.bind(workController));

// worker prifile settings
router.get("/worker/profile", workController.getWorkerProfileSettings.bind(workController));
router.get("/worker/profile-image/upload-signature", workController.getWorkerProfileImageUploadSignature.bind(workController));
router.patch("/worker/profile-image", workController.updateWorkerProfileImage.bind(workController));
router.patch("/worker/profile", workController.updateWorkerProfile.bind(workController));
//worker dash
router.get('/worker/dashboard-stats', workController.getWorkerDashboardStats.bind(workController));

//admin dash
router.get('/admin/work-stats', workController.getAdminWorkStats.bind(workController));

export default router
