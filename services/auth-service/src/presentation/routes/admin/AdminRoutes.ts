import { Router } from "express";
import { AdminController } from "../../controllers/admin/AdminController";
import { AdminAuthMiddleware } from "../../middlewares/AdminAuthMiddleware";

const router = Router()

router.post('/admin/login', AdminController.adminLogin)


export default router

