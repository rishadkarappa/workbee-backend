import { inject, injectable } from "tsyringe";
import { IWorkerGrpcService } from "../../../domain/services/IWorkerGrpcService";
import { ITokenService } from "../../../domain/services/ITokenService";

@injectable()
export class WorkerLoginUseCase {
  constructor(
    @inject("WorkerGrpcService") private workerGrpcService: IWorkerGrpcService,
    @inject("TokenService") private tokenService: ITokenService
  ) {}

  async execute(email: string, password: string) {
    // Validate credentials via gRPC
    const result = await this.workerGrpcService.validateWorkerCredentials(email, password);

    if (!result.success || !result.worker) {
      throw new Error(result.message);
    }

    // Generate JWT token using worker's id
    const token = this.tokenService.generate(result.worker.id);

    return {
      worker: result.worker,
      token
    };
  }
}