// import jwt from "jsonwebtoken"
// import { NextFunction, Request, Response } from "express";
// import { isPublic } from "../utils/public-routes";

// const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret2233';

// export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

//     if (isPublic(req)) {
//         return next();
//     }

//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ error: "Access denied. No token provided." });
//     }

//     try {
//         const token = authHeader.split(" ")[1];
//         const payload = jwt.verify(token, JWT_SECRET);

//         (req as any).user = payload;

//         return next();

//     } catch (e) {
//         return res.status(403).json({ error: "Invalid token" });
//     }
// };

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
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, JWT_SECRET) as any;

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

    } catch (e) {
        return res.status(403).json({ error: "Invalid token" });
    }
};