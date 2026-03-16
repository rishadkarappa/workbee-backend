import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./infrastructure/config/connectDB";

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT);

const startServer = async () => {
  try {
    await connectDB();
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Payment Service running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();