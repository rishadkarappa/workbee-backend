import { Router } from "express";
import { UserContoller } from "../controllers/UserController";

const router = Router();

router.post("/register", UserContoller.register);
router.get("/verifyOtp", UserContoller.verifyOtp)
router.post("/login", UserContoller.login);

export default router;
