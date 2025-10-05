import { Router } from "express";
import { AdminController } from "../../controllers/admin/AdminController";

const router = Router()

router.post('/admin/login', AdminController.adminLogin)

export default router

