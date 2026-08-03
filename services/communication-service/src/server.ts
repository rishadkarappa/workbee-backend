import "reflect-metadata";
import "dotenv/config";
import "./infrastructure/di/container";

import express from 'express';
import http from 'http';
import { connectDatabase } from "./infrastructure/config/connectMongo";
import chatRoutes from './presentation/routes/ChatRoute';
import uploadRoutes from './presentation/routes/UploadRoutes';
import { SocketGateway } from "./infrastructure/socket/gateway/SocketGateway";
import { authMiddleware } from "./presentation/middleware/authMiddleware";
import { RabbitMQInitializer } from "./infrastructure/message-bus/RabbitMQInitializer";
import { logger } from "./infrastructure/logger/logger";
import { ENV } from "./infrastructure/config/env";

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
    logger.info('Communication service Database connected');

    await RabbitMQInitializer.initialize();
    logger.info('Communication service Rabbitmq connected and initialized');

    new SocketGateway(httpServer);
    logger.info('Communication service Socket.IO initialized');

    httpServer.listen(ENV.PORT, () =>
      logger.info(`Communication service running on port ${ENV.PORT}`)
    );
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();