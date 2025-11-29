import { WorkerResponseDto } from "../../dtos/WorkerDTO";

export interface IGetAllWorkersUseCase {
    execute(): Promise<WorkerResponseDto[]>;
}

