import "reflect-metadata"
import "./infrastructure/di/container"

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDatabase } from "./infrastructure/config/connectMongo";
import { RabbitMQClient } from "./infrastructure/message-bus";

import UserRoutes from './presentation/routes/user/UserRoutes'
import AdminRoutes from './presentation/routes/admin/AdminRoutes'
import WorkerRoutes from './presentation/routes/worker/WorkerRoutes'
import RedisClient from "./infrastructure/config/RedisClient";

const PORT = process.env.PORT

const app = express();
app.use(express.json());

app.use("/", UserRoutes)
app.use("/", AdminRoutes)
app.use("/", WorkerRoutes)

const startServer = async () => {
    try {
        await connectDatabase();
        console.log('Database connected');
        
        await RabbitMQClient.initialize();
        console.log('RabbitMQ initialized');

        RedisClient.getInstance();
        console.log('Redis initialized');
        
        app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();