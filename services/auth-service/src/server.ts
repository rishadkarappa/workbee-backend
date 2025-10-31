import "reflect-metadata"
import "./infrastructure/di/container"

import dotenv from "dotenv";
dotenv.config();


import express from "express";
import { connectDatabase } from "./infrastructure/config/connectMongo";
import { UserGrpcServer } from "./infrastructure/grpc/servers/UserGrpcServer";

import UserRoutes from './presentation/routes/user/UserRoutes'
import AdminRoutes from './presentation/routes/admin/AdminRoutes'
import WorkerRoutes from './presentation/routes/worker/WorkerRoutes'

const PORT = process.env.PORT
const USER_GRPC_PORT = process.env.USER_GRPC_PORT!

const app = express();
app.use(express.json());


app.use("/", UserRoutes)
app.use("/", AdminRoutes)
app.use("/", WorkerRoutes)

connectDatabase().then(() => {
  app.listen(PORT, () => console.log('Auth Service running on port 4001'))
})

const userGrpcServer = new UserGrpcServer()
userGrpcServer.start(USER_GRPC_PORT)