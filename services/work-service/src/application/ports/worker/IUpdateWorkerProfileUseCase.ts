import { UpdateWorkerProfileReqDTO, WorkerProfileResponseDTO } from "../../dtos/worker/UpdateWorkerProfileDTO";

export interface IUpdateWorkerProfileUseCase {
    execute(data: UpdateWorkerProfileReqDTO): Promise<WorkerProfileResponseDTO | null>;
}