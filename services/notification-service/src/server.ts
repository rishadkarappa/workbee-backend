import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDatabase } from "./infrastructure/config/connectMongo";
import { RabbitMQClient } from "./infrastructure/message-bus/client";
import { container } from "./infrastructure/di/container";
import { SocketGateway } from "./infrastructure/socket/SocketGateway";
import { MessageEventConsumer } from "./infrastructure/message-bus/MessageEventConsumer";
import notificationRoutes from "./presentation/routes/notificationRoutes";
import { extractUser } from "./presentation/middlewares/extractUser";
import { logger } from "./infrastructure/config/logger";

const PORT = process.env.PORT;

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// user-extraction middleware
app.use(extractUser)

// Routes
app.use('/', notificationRoutes);

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    logger.info('Notification Service Database connected');

    // Connect to RabbitMQ
    await RabbitMQClient.initialize();
    logger.info('Notification Service RabbitMQ connected');

    // Initialize Socket.IO
    const socketManager = new SocketGateway(httpServer);
    container.registerInstance("SocketManager", socketManager);
    logger.info('Notification Service Socket.IO initialized');

    // Start message consumer
    const messageConsumer = container.resolve(MessageEventConsumer);
    await messageConsumer.start();
    logger.info('Notification Service Message consumer started');

    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`Notification service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

startServer();