import { WorkResponseDto } from "../../dtos/WorkDTO";

// export interface IGetAllWorksUseCase {
//     execute(): Promise<WorkResponseDto[]>;
// }


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