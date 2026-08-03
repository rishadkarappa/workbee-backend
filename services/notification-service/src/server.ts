import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDatabase } from "./infrastructure/config/connectMongo";
import { RabbitMQInitializer } from "./infrastructure/message-bus/RabbitMQInitializer";
import { container } from "./infrastructure/di/container";
import { SocketGateway } from "./infrastructure/socket/SocketGateway";
import notificationRoutes from "./presentation/routes/notificationRoutes";
import { extractUser } from "./presentation/middlewares/extractUser";
import { logger } from "./infrastructure/config/logger";
import { ENV } from "./infrastructure/config/env";

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors({
  origin: ENV.CORS_ORIGIN,
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

    // Initialize Socket.IO
    const socketManager = new SocketGateway(httpServer);
    container.registerInstance("SocketManager", socketManager);
    logger.info('Notification Service Socket.IO initialized');

    // Connect to RabbitMQ
    await RabbitMQInitializer.initialize();
    logger.info('Notification Service RabbitMQ connected and consumer started');


    // Start server
    httpServer.listen(ENV.PORT, () => {
      logger.info(`Notification service running on port ${ENV.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  process.exit(0);
});

startServer();