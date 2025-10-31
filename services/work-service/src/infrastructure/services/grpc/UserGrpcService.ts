import { injectable } from "tsyringe";
import { IUserGrpcService, UserData } from "../../../domain/services/IUserGrpcService";
import { UserGrpcClient } from "../../grpc/clients/UserGrpcClient";

@injectable()
export class UserGrpcService implements IUserGrpcService {
    private client: UserGrpcClient;

    constructor() {
        const grpcAddress = process.env.AUTH_SERVICE_GRPC;
        this.client = new UserGrpcClient(grpcAddress);
    }

    async getUserById(userId: string): Promise<{ success: boolean; message: string; user: UserData | null; }> {
        return await this.client.getUserById(userId)
    }

    async validateUser(userId: string): Promise<{ success: boolean; message: string; isValid: boolean; }> {
        return await this.client.validateUser(userId)
    }
} 