import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { container } from 'tsyringe';
import { GetUserByIdUseCase } from '../../../application/use-cases/user/grpc/GetUserByIdUseCase';
import { ValidateUserUseCase } from '../../../application/use-cases/user/grpc/ValidateUserUseCase';

const PROTO_PATH = path.join(__dirname, '../../../../../../shared/protos/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;

export class UserGrpcServer {
  private server: grpc.Server;

  constructor() {
    this.server = new grpc.Server();
    this.setupServices();
  }

  private setupServices() {
    this.server.addService(userProto.UserService.service, {
      GetUserById: this.getUserById.bind(this),
      ValidateUser: this.validateUser.bind(this)
    });
  }

  private async getUserById(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { userId } = call.request;
      
      const getUserUseCase = container.resolve(GetUserByIdUseCase);
      const user = await getUserUseCase.execute(userId);

      callback(null, {
        success: true,
        message: 'User retrieved successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.email// want to change email to phone later becasue i dont have phone number normal user
        }
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        message: error.message,
        user: null
      });
    }
  }

  private async validateUser(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { userId } = call.request;
      
      const validateUserUseCase = container.resolve(ValidateUserUseCase);
      const isValid = await validateUserUseCase.execute(userId);

      callback(null, {
        success: true,
        message: isValid ? 'User is valid' : 'User not found',
        isValid
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        message: error.message,
        isValid: false
      });
    }
  }

  start(port: string) {
    this.server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, boundPort) => {
        if (err) {
          console.error('Failed to start User gRPC server:', err);
          return;
        }
        console.log(`Auth Service User gRPC server running on port ${boundPort}`);
      }
    );
  }
}