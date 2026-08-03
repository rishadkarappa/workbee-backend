import "reflect-metadata"
import "dotenv/config";

import "./infrastructure/di/container"

import express from "express";
import { connectDatabase } from "./infrastructure/config/connectMongo";
import { RabbitMQInitializer } from "./infrastructure/message-bus/RabbitMQInitializer";

import UserRoutes from './presentation/routes/user/UserRoutes'
import AdminRoutes from './presentation/routes/admin/AdminRoutes'
import WorkerRoutes from './presentation/routes/worker/WorkerRoutes'
import RedisClient from "./infrastructure/config/RedisClient";

import { errorHandler } from './presentation/middlewares/ErrorHandlerMiddleware';
import { ENV } from "./infrastructure/config/env";
import { logger } from "./infrastructure/logger/logger";

const app = express();
app.use(express.json());

app.use("/", UserRoutes)
app.use("/", AdminRoutes)
app.use("/", WorkerRoutes)

app.use(errorHandler)

const startServer = async () => {
    try {
        await connectDatabase();
        logger.info('Auth Service Database connected');

        await RabbitMQInitializer.initialize();
        logger.info('Auth Service RabbitMQ initialized');

        RedisClient.getInstance();
        logger.info('Auth Service Redis initialized');

        app.listen(ENV.PORT, () => logger.info(`Auth Service running on port ${ENV.PORT}`));
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();