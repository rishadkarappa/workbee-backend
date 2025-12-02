
export interface ITokenService {
    generateAccess(id: string, role?: "user" | "admin" | "worker"): string;
    verifyAccess(token: string): { id: string; role?: string };
}
