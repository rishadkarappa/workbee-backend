import { WorkerLoginRequestDTO, WorkerLoginResponseDTO } from "../../dtos/worker/LoginWorkerDTO";

export interface IWorkerLoginUseCase {
    execute(data: WorkerLoginRequestDTO): Promise<WorkerLoginResponseDTO>;
}
