import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { httpLogger } from "./middleware/centralized-logging";
import { verifyToken } from "./middleware/auth-middleware";


const PORT = process.env.PORT;

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-role"]
}));

app.use(httpLogger);

app.use(verifyToken);

// services
const services = [
    {
        route: "/auth",
        target: process.env.AUTH_SERVICE
    },
    {
        route: "/work",
        target: process.env.WORK_SERVICE
    }
];

services.forEach((service) => {
    app.use(
        `${service.route}`,
        createProxyMiddleware({
            target: service.target,
            changeOrigin: true,
        })
    );
});

app.listen(PORT, () => console.log(`API Gateway running on ${PORT}`));
