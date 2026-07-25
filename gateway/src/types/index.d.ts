import { IJwtPayload } from "./IJwtPayload";

declare global {
    namespace Express {
        interface Request {
            user?:IJwtPayload
        }
    }
}

export{};
