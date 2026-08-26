import { Router } from "express";
import { container } from "tsyringe";
import { ReviewController } from "../controllers/ReviewController";

const router = Router();
const reviewController = container.resolve(ReviewController);

router.post('/review', reviewController.createReview.bind(reviewController));
router.get('/review/check/:workId', reviewController.checkReviewExists.bind(reviewController));
router.get('/worker-profile-stats/:workerId', reviewController.getWorkerProfileStats.bind(reviewController));

export default router;