import "reflect-metadata";
import "./infrastructure/di/container";

import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import http from 'http';
import { connectDatabase } from "./infrastructure/config/connectMongo";
import chatRoutes from './presentation/routes/ChatRoute';
import { SocketManager } from "./infrastructure/socket/SocketManager";
import { authMiddleware } from "./presentation/middleware/authMiddleware";

const PORT = process.env.PORT;
const app = express();

// Parse JSON
app.use(express.json());

// Apply JWT verification middleware
app.use(authMiddleware);

// Mount routes
app.use('/', chatRoutes);

const httpServer = http.createServer(app);

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connected');

    const socketManager = new SocketManager(httpServer);
    console.log('Socket.IO initialized');

    httpServer.listen(PORT, () => console.log(`Communication service running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();