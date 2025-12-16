import { injectable, inject } from "tsyringe";
import {
    WorkerLoginRequestDTO,
    WorkerLoginResponseDTO
} from "../../dtos/worker/LoginWorkerDTO";

import {
    WorkerLoginRequestRMQDTO,
    WorkerLoginResponseRMQDTO
} from "../../dtos/worker/WorkerLoginRMQDTO";

import { WorkerValidationClient, RabbitMQConnection } from "../../../infrastructure/message-bus";
import { WorkerMapper } from "../../mappers/WorkerMapper";
import { IWorkerLoginUseCase } from "../../ports/worker/IWorkerLoginUseCase";
import { ITokenService } from "../../../domain/services/ITokenService";

@injectable()
export class WorkerLoginUseCase implements IWorkerLoginUseCase {
    constructor(
        @inject("TokenService") private _tokenService: ITokenService
    ) {}

    async execute(data: WorkerLoginRequestDTO): Promise<WorkerLoginResponseDTO> {
        const { email, password } = data;

        const channel = await RabbitMQConnection.getChannel();
        const client = new WorkerValidationClient(channel);

        const response: WorkerLoginResponseRMQDTO = await client.validateWorker(email, password);

        if (!response.success) {
            throw new Error(response.error || "Worker validation failed");
        }

        // Generate  access and refresh tokens
        const accessToken = this._tokenService.generateAccess(response.data.id, "worker");
        const refreshToken = this._tokenService.generateRefresh(response.data.id, "worker");

        // Store refresh token in Redis
        await this._tokenService.storeRefreshToken(response.data.id, refreshToken);

        return WorkerMapper.toLoginResponse({
            ...response.data,
            accessToken,
            refreshToken
        });
    }
}