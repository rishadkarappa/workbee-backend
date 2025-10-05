import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT

const app = express();
app.use(cors());

//auth service
app.use("/auth", createProxyMiddleware({
    target: "http://localhost:4001",
    changeOrigin: true
}));


app.listen(PORT, () => console.log("API Gateway running on 4000"));
