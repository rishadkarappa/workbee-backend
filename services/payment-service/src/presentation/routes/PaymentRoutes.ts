import { Router } from "express";
import { container } from "tsyringe";
import { PaymentController } from "../controller/PaymentController";

const router = Router();

const paymentController = container.resolve(PaymentController);

router.post("/create-checkout-session", paymentController.createCheckoutSession.bind(paymentController));

router.post("/webhook", paymentController.handleWebhook.bind(paymentController));

router.post("/work-completed", paymentController.workCompleted.bind(paymentController));

router.get("/wallet", paymentController.getWallet.bind(paymentController));

router.get("/admin/summary", paymentController.getAdminSummary.bind(paymentController));

export default router;