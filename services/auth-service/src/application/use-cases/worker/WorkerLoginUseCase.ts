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
        @inject("TokenService") private tokenService: ITokenService 
    ) {}

    async execute(data: WorkerLoginRequestDTO): Promise<WorkerLoginResponseDTO> {
        const { email, password } = data;

        const channel = await RabbitMQConnection.getChannel();
        const client = new WorkerValidationClient(channel);

        const response: WorkerLoginResponseRMQDTO = await client.validateWorker(email, password);
        // console.log("ress",response)
        if (!response.success) {
            throw new Error(response.error || "Worker validation failed");
        }

        const token = this.tokenService.generateAccess(response.data.id, "worker");

        return WorkerMapper.toLoginResponse({
            ...response.data,
            token: token
        });
    }
}
