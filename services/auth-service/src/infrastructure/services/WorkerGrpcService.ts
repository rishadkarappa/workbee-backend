import { injectable } from "tsyringe";
import { IWorkerGrpcService, WorkerData } from "../../domain/services/IWorkerGrpcService";
import { WorkerGrpcClient } from "../grpc/WorkerGrpcClient";

@injectable()
export class WorkerGrpcService implements IWorkerGrpcService {
  private client: WorkerGrpcClient;

  constructor() {
    const grpcAddress = process.env.WORK_SERVICE_GRPC;
    this.client = new WorkerGrpcClient(grpcAddress);
  }

  async validateWorkerCredentials(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    worker: WorkerData | null;
  }> {
    return await this.client.validateWorkerCredentials(email, password);
  }
}