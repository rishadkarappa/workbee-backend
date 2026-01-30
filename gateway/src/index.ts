import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { httpLogger } from "./middleware/centralized-logging";
import { verifyToken } from "./middleware/auth-middleware";

// env config
dotenv.config();

// gateway port
const PORT = process.env.PORT;

// create app
const app = express();

// cors origin policy
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// centerlized logging (mogran, winston)
app.use(httpLogger);

// autherization before hitting services
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
    },
    {
        route:"/communication",
        target: process.env.COMMUNICATION_SERVICE
    },
    // {
    //     route:"/notification",
    //     target: process.env.NOTIFICATION_SERVICE
    // }
];

// forward routes to services
services.forEach((service) => {
    app.use(
        `${service.route}`,
        createProxyMiddleware({
            target: service.target,
            changeOrigin: true,
        })
    );
});

// gateway port litsening
app.listen(PORT, () => console.log(`API Gateway running on ${PORT}`));
