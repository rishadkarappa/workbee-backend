import { Router } from "express";
import { UserController } from "../../controllers/user/UserController";

const router = Router();

router.post("/register", UserController.register);
router.post("/verifyOtp", UserController.verifyOtp);
router.post("/login", UserController.login);
router.get("/verify",UserController.verify)
router.post("/google-login",UserController.googleLogin)
router.post("/forgot-password", UserController.forgotPassword)
router.post("/reset-password/:token",UserController.resetPassword)

export default router;
