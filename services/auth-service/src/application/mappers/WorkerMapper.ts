import { WorkerLoginResponseDTO } from "../dtos/worker/LoginWorkerDTO";

export class WorkerMapper {
  static toLoginResponse(data: any): WorkerLoginResponseDTO {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      token: data.token
    };
  }
}
