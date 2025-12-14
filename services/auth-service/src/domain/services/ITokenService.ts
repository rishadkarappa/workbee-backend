export interface ITokenService {
    generateAccess(id: string, role?: "user" | "admin" | "worker"): string;
    generateRefresh(id: string, role?: "user" | "admin" | "worker"): string;
    verifyAccess(token: string): { id: string; role?: string };
    verifyRefresh(token: string): { id: string; role?: string };
    
    // redis operations
    storeRefreshToken(userId: string, token: string, expiresIn?: number): Promise<void>;
    getRefreshToken(userId: string): Promise<string | null>;
    deleteRefreshToken(userId: string): Promise<void>;
    validateRefreshToken(userId: string, token: string): Promise<boolean>;
}