import { WorkResponseDto } from "../../dtos/work/WorkDTO";

export interface IGetAllWorksUseCase {
    execute(filters?: {
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        works: WorkResponseDto[];
        total: number;
        totalPages: number;
    }>;
}