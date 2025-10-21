import "reflect-metadata";
import "./infrastructure/di/container"

import express from "express";
import dotenv from "dotenv"
dotenv.config()

import { connectDatabase } from "./infrastructure/config/connectMongo";


const PORT = process.env.PORT

import WorkRoutes from "./presentation/routes/WorkRoutes" 

const app = express()
app.use(express.json())

app.use("/", WorkRoutes)

connectDatabase().then(() => {
    app.listen(PORT, ()=> console.log('work service running on port 4002'))
})

