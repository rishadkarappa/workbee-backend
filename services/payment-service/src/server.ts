import "reflect-metadata";
import "./infrastructure/di/container";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./infrastructure/config/connectDB";

import paymentRoutes from "./presentation/routes/PaymentRoutes";
import { startPayoutWorker } from "./infrastructure/queue/PayoutQueue";
import { logger } from "./infrastructure/logger/logger";
import { ENV } from "./infrastructure/config/env";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());

app.use("/", paymentRoutes);

const startServer = async () => {
  try {
    await connectDB();
    startPayoutWorker();
    app.listen(ENV.PORT, () => {
      logger.info(`PaymentService Running on port ${ENV.PORT}`);
    });
  } catch (error) {
    logger.error("PaymentService Failed to start:", error);
    process.exit(1);
  }
};

startServer();