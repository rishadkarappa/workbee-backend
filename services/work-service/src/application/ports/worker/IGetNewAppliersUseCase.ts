import { WorkerResponseDto } from "../../dtos/worker/WorkerDTO";

export interface IGetNewAppliersUseCase {
    execute(page: number, limit: number, search: string): Promise<{
        workers: WorkerResponseDto[];
        total: number;
    }>;
}