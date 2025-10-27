import "reflect-metadata";
import "./infrastructure/di/container"

import express from "express";
import dotenv from "dotenv"
dotenv.config()

import { connectDatabase } from "./infrastructure/config/connectMongo";

const PORT = process.env.PORT
const GRPC_PORT = process.env.GRPC_PORT

import WorkRoutes from "./presentation/routes/WorkRoutes" 
import { WorkerGrpcServer } from "./infrastructure/grpc/WorkerGrpcServer";

const app = express()
app.use(express.json())

app.use("/", WorkRoutes)

connectDatabase().then(() => {
    app.listen(PORT, ()=> console.log('work service running on port 4002'))
})

const grpcServer = new WorkerGrpcServer();
grpcServer.start(GRPC_PORT!)

