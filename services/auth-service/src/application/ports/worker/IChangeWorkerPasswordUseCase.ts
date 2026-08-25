import { ChangeWorkerPasswordRequestDTO } from "../../dtos/worker/ChangeWorkerPasswordDTO";

export interface IChangeWorkerPasswordUseCase {
    execute(workerId: string, data: ChangeWorkerPasswordRequestDTO): Promise<void>;
}