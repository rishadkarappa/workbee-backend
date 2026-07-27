import { AuthenticatedWorkerDTO } from "../dtos/worker/AuthenticatedWorkerDTO";
import { WorkerLoginResponseDTO } from "../dtos/worker/LoginWorkerDTO";

type WorkerLoginMapperInput = AuthenticatedWorkerDTO & {
  accessToken: string;
  refreshToken: string;
};

export class WorkerMapper {
  static toLoginResponse(data: WorkerLoginMapperInput): WorkerLoginResponseDTO {
    const { accessToken, refreshToken, ...worker } = data;

    return {
      worker,
      accessToken,
      refreshToken,
    };
  }
}