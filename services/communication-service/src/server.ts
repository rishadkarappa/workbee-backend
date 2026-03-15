import "reflect-metadata";
import "./infrastructure/di/container";

import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import http from 'http';
import { connectDatabase } from "./infrastructure/config/connectMongo";
import chatRoutes from './presentation/routes/ChatRoute';
import uploadRoutes from './presentation/routes/UploadRoutes';
import { SocketManager } from "./infrastructure/socket/SocketManager";
import { authMiddleware } from "./presentation/middleware/authMiddleware";
import { RabbitMQClient } from "./infrastructure/message-bus/Client";

const PORT = process.env.PORT;
const app = express();

// Parse JSON and multipart (multer handles multipart inside the route itself)
app.use(express.json());

// Single global auth middleware
app.use(authMiddleware);

// Mount routes
app.use('/', chatRoutes);
app.use('/', uploadRoutes);

const httpServer = http.createServer(app);

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('-- Database connected');

    await RabbitMQClient.initialize();
    console.log('-- Rabbitmq connected');

    const socketManager = new SocketManager(httpServer);
    console.log('-- Socket.IO initialized');

    httpServer.listen(PORT, () =>
      console.log(`Communication service running on port ${PORT}`)
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();