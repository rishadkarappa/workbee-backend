import { WorkerLoginResponseDTO } from "../dtos/worker/LoginWorkerDTO";

export class WorkerMapper {
  static toLoginResponse(data: any): WorkerLoginResponseDTO {
    return {
      worker: {
        id: data.id,
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        location: data.location,
        workType: data.workType,
        preferredWorks: data.preferredWorks,
        status: data.status
      },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    };
  }
}