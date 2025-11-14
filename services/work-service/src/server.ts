import "reflect-metadata";
import "./infrastructure/di/container"

import express from "express";
import dotenv from "dotenv"
import path from "path";
dotenv.config()

import { connectDatabase } from "./infrastructure/config/connectMongo";
import { RabbitMQClient } from "./infrastructure/message-bus";

const PORT = process.env.PORT

import WorkRoutes from "./presentation/routes/WorkRoutes" 

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/", WorkRoutes)

const startServer = async () => {
    try {
        await connectDatabase();
        console.log('-- Database connected');
        
        await RabbitMQClient.initialize();
        console.log('-- RabbitMQ initialized');
        
        app.listen(PORT, () => console.log(`-- Work service running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();