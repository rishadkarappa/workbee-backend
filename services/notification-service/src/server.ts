import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { connectDatabase } from "./infrastructure/config/connectMongo";

const PORT = process.env.PORT;

const app = express();
// Parse JSON
app.use(express.json());

// initialize server
const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connected');

    app.listen(PORT, () => console.log(`Notification service running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();