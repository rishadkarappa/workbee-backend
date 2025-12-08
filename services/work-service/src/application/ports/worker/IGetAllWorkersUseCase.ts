import { WorkerResponseDto } from "../../dtos/WorkerDTO";

export interface IGetAllWorkersUseCase {
    execute(page: number, limit: number, search: string): Promise<{
        workers: WorkerResponseDto[];
        total: number;
    }>;
}
