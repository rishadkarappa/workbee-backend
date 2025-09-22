import { Router } from "express";
import { UserContoller } from "../controllers/UserController";

const router = Router();

router.post("/register", UserContoller.register);
router.post("/login", UserContoller.login);
router.get("/verify", UserContoller.verify)

export default router;
