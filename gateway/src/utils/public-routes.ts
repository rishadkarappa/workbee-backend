import { Request } from "express"

export const PUBLIC_ROUTES: { method: string; path: string }[] = [
    { method: "POST", path: "/auth/register" },
    { method: "POST", path: "/auth/verifyOtp" },
    { method: "POST", path: "/auth/login" },
    { method: "GET",  path: "/auth/verify" },
    { method: "POST", path: "/auth/google-login" },
    { method: "POST", path: "/auth/forgot-password" },
    { method: "POST", path: "/auth/reset-password/:token" },
    { method: "POST", path: "/auth/reset-password/:token" },
    { method: "POST", path: "/auth/worker-login" },
    { method: "POST", path: "/auth/admin/login" },
    
    { method: "POST", path: "/work/apply-worker" },

];

export const isPublic = (req: Request): boolean => {
    return PUBLIC_ROUTES.some(
        (request) => request.method === req.method && request.path === req.path
    )
}


