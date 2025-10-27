import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../../../../shared/protos/worker.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const workerProto = grpc.loadPackageDefinition(packageDefinition).worker as any;

export interface WorkerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  workType: string;
  preferredWorks: string[];
  isApproved: boolean;
}

export class WorkerGrpcClient {
  private client: any;

  constructor(serverAddress: string = 'localhost:50051') {
    this.client = new workerProto.WorkerService(
      serverAddress,
      grpc.credentials.createInsecure()
    );
  }

  validateWorkerCredentials(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    worker: WorkerData | null;
  }> {
    return new Promise((resolve, reject) => {
      this.client.ValidateWorkerCredentials(
        { email, password },
        (error: grpc.ServiceError | null, response: any) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(response);
        }
      );
    });
  }
}