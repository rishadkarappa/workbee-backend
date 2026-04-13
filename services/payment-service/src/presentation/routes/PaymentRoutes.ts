import { Router } from "express";
import { container } from "tsyringe";
import { PaymentController } from "../controller/PaymentController";

const router = Router();

const paymentController = container.resolve(PaymentController);

router.post("/create-order", paymentController.createOrder.bind(paymentController));
router.post("/verify", paymentController.verifyPayment.bind(paymentController));
router.post("/work-completed", paymentController.workCompleted.bind(paymentController));
router.get("/wallet", paymentController.getWallet.bind(paymentController));
router.get("/admin/summary", paymentController.getAdminSummary.bind(paymentController));

export default router;