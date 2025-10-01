import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.post("/register", UserController.register);
router.post("/verifyOtp", UserController.verifyOtp);
router.post("/login", UserController.login);
router.get("/verify",UserController.verify)

export default router;
