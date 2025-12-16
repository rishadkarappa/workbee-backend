import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express";
import { isPublic } from "../utils/public-routes";

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    if (isPublic(req)) {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log(`No token provided for ${req.method} ${req.path}`);
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, JWT_SECRET) as any;

        // Log successful verification
        // console.log(`token verified for user ${payload.id || payload.userId} - ${req.method} ${req.path}`);

        // Only set headers if values exist (not undefined)
        if (payload.userId || payload.id) {
            req.headers['x-user-id'] = payload.userId || payload.id;
        }
        
        if (payload.email) {
            req.headers['x-user-email'] = payload.email;
        }
        
        if (payload.role) {
            req.headers['x-user-role'] = payload.role;
        }

        (req as any).user = payload;

        return next();

    } catch (e: any) {
        console.log(`Token verification failed for ${req.method} ${req.path}:`, e.message);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};