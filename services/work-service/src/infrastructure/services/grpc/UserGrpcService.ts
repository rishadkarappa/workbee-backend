import { injectable } from "tsyringe";
import { IUserGrpcService, UserData } from "../../../domain/services/IUserGrpcService";
import { UserGrpcClient } from "../../grpc/clients/UserGrpcClient";

@injectable()
export class UserGrpcService implements IUserGrpcService {
    private client: UserGrpcClient;

    constructor() {
        const grpcAddress = process.env.AUTH_SERVICE_GRPC || 'localhost:50052';
        this.client = new UserGrpcClient(grpcAddress);
    }

    async getUserById(userId: string): Promise<{ success: boolean; message: string; user: UserData | null; }> {
        // console.log("UserGrpcService.getUserById called with userId:", userId);
        try {
            const result = await this.client.getUserById(userId);
            console.log("getUserById result:", result);
            return result;
        } catch (error: any) {
            console.error("getUserById error:", error);
            throw error;
        }
    }

    async validateUser(userId: string): Promise<{ success: boolean; message: string; isValid: boolean; }> {
        try {
            const result = await this.client.validateUser(userId);
            console.log("validateUser result:", result);
            return result;
        } catch (error: any) {
            console.error("validateUser error:", error);
            throw error;
        }
    }
}