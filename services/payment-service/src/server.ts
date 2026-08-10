import "reflect-metadata";
import "dotenv/config";

import "./infrastructure/di/container";


import express from "express";
import cors from "cors";
import { connectDB } from "./infrastructure/config/connectDB";

import paymentRoutes from "./presentation/routes/PaymentRoutes";
import { startPayoutWorker } from "./infrastructure/queue/PayoutQueue";
import { logger } from "./infrastructure/logger/logger";
import { ENV } from "./infrastructure/config/env";

const app = express();

app.use(cors({
  origin: ENV.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());

app.use("/", paymentRoutes);

const startServer = async () => {
  try {
    // connecton DB
    await connectDB();

    // worker payout
    startPayoutWorker();

    // server 
    app.listen(ENV.PORT, () => logger.info(`PaymentService Running on port ${ENV.PORT}`));

  } catch (error) {
    logger.error("PaymentService Failed to start:", error);
    process.exit(1);
  }
};

startServer();