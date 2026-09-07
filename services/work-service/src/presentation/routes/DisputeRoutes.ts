import { Router } from "express";
import { container } from "tsyringe";
import { DisputeController } from "../controllers/DisputeController";

const router = Router()
const disputeController = container.resolve(DisputeController)


export default router