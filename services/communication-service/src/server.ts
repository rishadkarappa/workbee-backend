// import "reflect-metadata"
// import "./infrastructure/di/container";

// import dotenv from "dotenv";
// dotenv.config()

// import cors from "cors";

// import express from 'express';
// import { connectDatabase } from "./infrastructure/config/connectMongo";

// import chatRoutes from './presentation/routes/ChatRoute';
// import { SocketManager } from "./infrastructure/socket/SocketManager";


// const PORT = process.env.PORT
// const app = express()
// app.use(express.json())

// app.use(cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true
// }));
// app.use(express.json());

// app.use('/chat', chatRoutes);

// const startServer = async ()  => {
//     try {
//         await connectDatabase()
//         console.log('database connected')

//         // const socketManager = new SocketManager(httpServer);


//         app.listen(PORT, ()=> console.log(`communication service running on port${PORT}`))
//     } catch (error) {
//         console.log('failed to start server')
//         process.exit(1)
//     }
// }
// startServer()


import "reflect-metadata";
import "./infrastructure/di/container"; // Register dependencies

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from 'express';
import http from 'http';
import { connectDatabase } from "./infrastructure/config/connectMongo";
import chatRoutes from './presentation/routes/ChatRoute';
import { SocketManager } from "./infrastructure/socket/SocketManager";

const PORT = process.env.PORT || 3003;
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use('/chat', chatRoutes);

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
