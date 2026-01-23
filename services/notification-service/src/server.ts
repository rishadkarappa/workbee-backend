import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDatabase } from "./infrastructure/config/connectMongo";
import { RabbitMQClient } from "./infrastructure/message-bus/client";
import { container } from "./infrastructure/di/container";
import { SocketManager } from "./infrastructure/socket/NotificationSocketManager";
import { MessageEventConsumer } from "./infrastructure/message-bus/MessageEventConsumer";
import notificationRoutes from "./presentation/routes/notificationRoutes";

const PORT = process.env.PORT || 4004;

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/', notificationRoutes);

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    console.log('Database connected');

    // Connect to RabbitMQ
    await RabbitMQClient.initialize();
    console.log('RabbitMQ connected');

    // Initialize Socket.IO
    const socketManager = new SocketManager(httpServer);
    container.registerInstance("SocketManager", socketManager);
    console.log('Socket.IO initialized');

    // Start message consumer
    const messageConsumer = container.resolve(MessageEventConsumer);
    await messageConsumer.start();
    console.log('Message consumer started');

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`Notification service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

startServer();