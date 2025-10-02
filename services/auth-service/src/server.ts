import "reflect-metadata"
import "./di/container"

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDatabase } from "./infrastructure/config/connectMongo";
import UserRoutes from './presentation/routes/user/UserRoutes'

const PORT = process.env.PORT

const app = express();
app.use(express.json());

app.use("/", UserRoutes)

connectDatabase().then(() => {
  app.listen(PORT, () => console.log('Auth Service running on port 4001'))
})
