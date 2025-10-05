import "reflect-metadata"
import "./di/container"

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from 'morgan';
import logger from "./shared/logger/logger";
import { connectDatabase } from "./infrastructure/config/connectMongo";

import UserRoutes from './presentation/routes/user/UserRoutes'
import AdminRoutes from './presentation/routes/admin/AdminRoutes'

const PORT = process.env.PORT

const app = express();
app.use(express.json());

// morgan + winston can check the app apies logs
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use("/", UserRoutes)
app.use("/", AdminRoutes)

connectDatabase().then(() => {
  app.listen(PORT, () => console.log('Auth Service running on port 4001'))
})
