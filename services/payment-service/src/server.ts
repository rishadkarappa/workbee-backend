import "reflect-metadata";
import "./infrastructure/di/container";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./infrastructure/config/connectDB";

import paymentRoutes from "./presentation/routes/PaymentRoutes";
import { startPayoutWorker } from "./infrastructure/queue/PayoutQueue";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// All other routes get JSON body
app.use(express.json());


// ── Routes
app.use("/", paymentRoutes);

// ── Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[PaymentService] Error:", err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

const PORT = Number(process.env.PORT);

const startServer = async () => {
  try {
    await connectDB();
    startPayoutWorker();
    app.listen(PORT, () => {
      console.log(`[PaymentService] Running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[PaymentService] Failed to start:", error);
    process.exit(1);
  }
};

startServer();