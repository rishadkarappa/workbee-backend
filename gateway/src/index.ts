import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { httpLogger } from "./middleware/centralized-logging";
import { verifyToken } from "./middleware/auth-middleware";

// Env config
dotenv.config();

// Gateway port
const PORT = process.env.PORT;

// Create app
const app = express();

// Cors origin policy
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Centerlized logging (mogran, winston)
app.use(httpLogger);

// Autherization before hitting services
app.use(verifyToken);

// Services
const services = [
    {
        route: "/auth",
        target: process.env.AUTH_SERVICE
    },
    {
        route: "/work",
        target: process.env.WORK_SERVICE
    },
    {
        route:"/communication",
        target: process.env.COMMUNICATION_SERVICE
    }
];

// Forward routes to services
services.forEach((service) => {
    app.use(
        `${service.route}`,
        createProxyMiddleware({
            target: service.target,
            changeOrigin: true,
        })
    );
});

// Gateway port litsening
app.listen(PORT, () => console.log(`API Gateway running on ${PORT}`));
