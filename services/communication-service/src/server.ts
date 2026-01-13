// import "reflect-metadata";
// import "./infrastructure/di/container";

// import dotenv from "dotenv";
// dotenv.config();

// import express from 'express';
// import http from 'http';
// import { connectDatabase } from "./infrastructure/config/connectMongo";
// import chatRoutes from './presentation/routes/ChatRoute';
// import { SocketManager } from "./infrastructure/socket/SocketManager";

// const PORT = process.env.PORT;
// const app = express();

// app.use(express.json());
// app.use('/', chatRoutes);

// const httpServer = http.createServer(app);

// const startServer = async () => {
//   try {
//     await connectDatabase();
//     console.log('Database connected');

//     const socketManager = new SocketManager(httpServer);
//     console.log('Socket.IO initialized');

//     httpServer.listen(PORT, () => console.log(`Communication service running on port ${PORT}`));
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// startServer();


// src/server.ts
import "reflect-metadata";
import "./infrastructure/di/container";

import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import http from 'http';
import { connectDatabase } from "./infrastructure/config/connectMongo";
import chatRoutes from './presentation/routes/ChatRoute';
import { SocketManager } from "./infrastructure/socket/SocketManager";

const PORT = process.env.PORT;
const app = express();

// Parse JSON
app.use(express.json());

// IMPORTANT: Add extract user middleware globally BEFORE routes
app.use((req, res, next) => {
    const userId = req.headers['x-user-id'] as string;
    const userRole = req.headers['x-user-role'] as string;
    const userEmail = req.headers['x-user-email'] as string;

    console.log('Global middleware - extracting user:', { userId, userRole, userEmail });

    if (userId && userRole) {
        (req as any).user = {
            id: userId,
            role: userRole,
            email: userEmail
        };
        console.log('User attached to request:', (req as any).user);
    } else {
        console.log('No user headers found');
    }

    next();
});

// Mount routes
app.use('/', chatRoutes);

const httpServer = http.createServer(app);

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connected');

    const socketManager = new SocketManager(httpServer);
    console.log('Socket.IO initialized');

    httpServer.listen(PORT, () => console.log(`Communication service running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();