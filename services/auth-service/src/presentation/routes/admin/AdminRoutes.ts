import { Router } from "express";
import { AdminController } from "../../controllers/admin/AdminController";
import { AdminAuthMiddleware } from "../../middlewares/AdminAuthMiddleware";
import { container } from "tsyringe";

const router = Router()

const adminContoller = container.resolve(AdminController)

router.post('/admin/login', adminContoller.adminLogin.bind(adminContoller))

// router.get('/admin/dashboard', AdminController.adminDashboard)

export default router

