import { AdminUserStatsResponseDto } from "../../dtos/admin/AdminUserStatsDTO";

export interface IGetAdminUserStatsUseCase {
    execute(): Promise<AdminUserStatsResponseDto>;
}