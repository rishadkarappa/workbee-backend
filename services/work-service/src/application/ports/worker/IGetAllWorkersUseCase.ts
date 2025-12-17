import { WorkerResponseDto } from "../../dtos/worker/WorkerDTO";

export interface IGetAllWorkersUseCase {
    execute(page: number, limit: number, search: string, status?: string): Promise<{ 
        workers: WorkerResponseDto[];
        total: number
     }>;

}
