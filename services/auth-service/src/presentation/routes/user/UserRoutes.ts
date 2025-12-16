import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../../controllers/user/UserController";

const router = Router();

const userController = container.resolve(UserController);

router.post("/register", userController.register.bind(userController));
router.post("/verifyOtp", userController.verifyOtp.bind(userController));
router.post("/resend-otp", userController.resendOtp.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get("/verify", userController.verify.bind(userController))
router.post("/google-login", userController.googleLogin.bind(userController))
router.post("/forgot-password", userController.forgotPassword.bind(userController))
router.post("/reset-password/:token", userController.resetPassword.bind(userController))
router.post("/refresh-token", userController.refreshToken.bind(userController));
router.post("/logout", userController.userLogout.bind(userController));

export default router;
