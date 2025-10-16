import express from "express";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import { connectDatabase } from "./infrastructure/config/connectMongo";

const PORT = process.env.PORT

const app = express()

connectDatabase().then(() => {
    app.listen(PORT, ()=> console.log('work service running on port 4002'))
})

