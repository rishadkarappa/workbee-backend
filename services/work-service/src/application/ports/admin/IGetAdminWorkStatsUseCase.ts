import { AdminWorkStatsResponseDto } from "../../dtos/admin/AdminWorkStatsDTO";

export interface IGetAdminWorkStatsUseCase {
    execute(): Promise<AdminWorkStatsResponseDto>;
}