import { injectable, inject } from "tsyringe";
import {
    WorkerLoginRequestDTO,
    WorkerLoginResponseDTO
} from "../../dtos/worker/LoginWorkerDTO";

import {
    // WorkerLoginRequestRMQDTO,
    WorkerLoginResponseRMQDTO
} from "../../dtos/worker/WorkerLoginRMQDTO";

import { RabbitMQConnection } from "../../../infrastructure/config/rabbitmq";
import { WorkerValidationClient } from "../../../infrastructure/message-bus/WorkerLoginValidationClient";
import { WorkerMapper } from "../../mappers/WorkerMapper";
import { IWorkerLoginUseCase } from "../../ports/worker/IWorkerLoginUseCase";
import { ITokenService } from "../../../domain/services/ITokenService";
import { UserRole } from "workbee-common";
import { ErrorMessages } from "../../../shared/constants/ErrorMessages";

@injectable()
export class WorkerLoginUseCase implements IWorkerLoginUseCase {
    constructor(
        @inject("TokenService") private readonly _tokenService: ITokenService
    ) {}

    async execute(data: WorkerLoginRequestDTO): Promise<WorkerLoginResponseDTO> {
        const { email, password } = data;

        const channel = await RabbitMQConnection.getChannel();
        const client = new WorkerValidationClient(channel);
        
        const response: WorkerLoginResponseRMQDTO = await client.validateWorker(email, password);
        
        if (!response.success) {
            throw new Error(response.error || ErrorMessages.WORKER.WORKER_VALIDATION_FAILED);
        }
        
        const worker = response.data!;
        
        // Generate  access and refresh tokens
        const accessToken = this._tokenService.generateAccess(worker.id, UserRole.WORKER);
        const refreshToken = this._tokenService.generateRefresh(worker.id, UserRole.WORKER);

        // Store refresh token in Redis
        await this._tokenService.storeRefreshToken(worker.id, refreshToken);

        return WorkerMapper.toLoginResponse({
            ...worker,
            accessToken,
            refreshToken
        });
    }
}