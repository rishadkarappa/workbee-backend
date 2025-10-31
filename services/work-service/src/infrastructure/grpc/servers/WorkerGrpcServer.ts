import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { container } from 'tsyringe';
import { ValidateWorkerCredentialsUseCase } from '../../../use-case/ValidateWorkerCredentialsUseCase';

const PROTO_PATH = path.join(__dirname, '../../../../../shared/protos/worker.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const workerProto = grpc.loadPackageDefinition(packageDefinition).worker as any;

export class WorkerGrpcServer {
  private server: grpc.Server;

  constructor() {
    this.server = new grpc.Server();
    this.setupServices();
  }

  private setupServices() {
    this.server.addService(workerProto.WorkerService.service, {
      ValidateWorkerCredentials: this.validateWorkerCredentials.bind(this)
    });
  }

  private async validateWorkerCredentials(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { email, password } = call.request;
      
      const validateWorkerCredentialsUseCase = container.resolve(ValidateWorkerCredentialsUseCase);
      const worker = await validateWorkerCredentialsUseCase.execute(email, password);

      callback(null, {
        success: true,
        message: 'Worker validated successfully',
        worker: {
          id: worker.id,
          name: worker.name,
          email: worker.email,
          phone: worker.phone,
          location: worker.location,
          workType: worker.workType,
          preferredWorks: worker.preferredWorks,
          isApproved: worker.isApproved
        }
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        message: error.message,
        worker: null
      });
    }
  }

  start(port: string) {
    this.server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error('Failed to start gRPC server:', err);
          return;
        }
        console.log(`Work Service gRPC server running on port ${port}`);
      }
    );
  }
}