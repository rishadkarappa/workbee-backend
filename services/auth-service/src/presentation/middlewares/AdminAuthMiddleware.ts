import { Request, Response, NextFunction } from "express";
import { inject } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenService } from "../../domain/services/ITokenService";

export class AdminAuthMiddleware {
    constructor(
        @inject("ITokenService") private tokenSerivce:ITokenService,
        @inject("IUserRepository") private userRepository: IUserRepository
    ) {}

    async authenticateAdminToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
                res.status(401).json({ message: "No token provided" });
                return;
            }
            const token = authHeader.split(" ")[1]
            const payLoad = this.tokenSerivce.verifyAccess(token)
            const user = await this.userRepository.findById(payLoad.id)
            if(!user||user.role !== 'admin'){
                res.status(403).json({message:'only access admins '})
                return;
            }
            (req as any).user = payLoad
            next()
        } catch (error: any) {
            console.log(error)
            res.status(401).json({message:'invalid or expired token'})
        }
    }
}