import "reflect-metadata";
import "./infrastructure/di/container"

import express from "express";
import path from "path";

import { connectDatabase } from "./infrastructure/config/connectMongo";
import { RabbitMQClient } from "./infrastructure/message-bus/client";

const PORT = process.env.PORT

import WorkRoutes from "./presentation/routes/WorkRoutes" 
import { errorHandler } from './presentation/middlewares/ErrorHandlerMiddleware';
import { logger } from "./infrastructure/logger/logger";

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/", WorkRoutes)

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDatabase();
        logger.info('Work Service Database connected');
        
        await RabbitMQClient.initialize();
        logger.info('Work Service RabbitMQ initialized');
        
        app.listen(PORT, () => logger.info(`- Work service running on port ${PORT}`));
    } catch (error) {
        logger.error('Failed to start work service server:', error);
        process.exit(1);
    }
};

startServer();