import "reflect-metadata"

import dotenv from "dotenv";
dotenv.config()

import express from 'express';
import { connectDatabase } from "./infrastructure/config/connectMongo";

const PORT = process.env.PORT
const app = express()
app.use(express.json())

const startServer = async ()  => {
    try {
        await connectDatabase()
        console.log('database connected')

        app.listen(PORT, ()=> console.log(`communication service running on port${PORT}`))
    } catch (error) {
        console.log('failed to start server')
        process.exit(1)
    }
}
startServer()