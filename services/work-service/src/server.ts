import "reflect-metadata";
import "./infrastructure/di/container"

import express from "express";

import { connectDatabase } from "./infrastructure/config/connectMongo";
import { RabbitMQInitializer } from "./infrastructure/message-bus/RabbitMQInitializer";

/** work service routes */
import WorkRoutes from "./presentation/routes/WorkRoutes" 
import reviewRoutes from "./presentation/routes/ReviewRoutes" 
import disputeRoutes from "./presentation/routes/DisputeRoutes" 

import { errorHandler } from './presentation/middlewares/ErrorHandlerMiddleware';
import { logger } from "./infrastructure/logger/logger";
import { ENV } from "./infrastructure/config/env";

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", WorkRoutes)
app.use("/", reviewRoutes)
app.use("/", disputeRoutes)

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDatabase();
        logger.info('Work Service Database connected');
        
        await RabbitMQInitializer.initialize();
        logger.info('Work Service RabbitMQ initialized');
        
        app.listen(ENV.PORT, () => logger.info(`- Work service running on port ${ENV.PORT}`));
    } catch (error) {
        logger.error('Failed to start work service server:', error);
        process.exit(1);
    }
};

startServer();