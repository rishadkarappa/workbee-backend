import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from 'dotenv'
import { httpLogger } from "./middleware/centralized-logging";

dotenv.config()
const PORT = process.env.PORT

const app = express();
app.use(cors());

app.use(httpLogger)


// Auth Service
app.use("/auth", createProxyMiddleware({
    target: "http://localhost:4001",
    changeOrigin: true
}));

// Work Service
app.use("/work", createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true
}))


app.listen(PORT, () => console.log("API Gateway running on 4000"));
