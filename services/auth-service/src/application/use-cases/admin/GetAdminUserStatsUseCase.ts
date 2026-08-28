import { inject, injectable } from "tsyringe";
import { UserRole } from "workbee-common";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IGetAdminUserStatsUseCase } from "../../ports/admin/IGetAdminUserStatsUseCase";
import { AdminUserStatsResponseDto } from "../../dtos/admin/AdminUserStatsDTO";

@injectable()
export class GetAdminUserStatsUseCase implements IGetAdminUserStatsUseCase {
    constructor(
        @inject("UserRepository") private readonly _userRepository: IUserRepository
    ) { }

    async execute(): Promise<AdminUserStatsResponseDto> {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [totalUsers, newUsersThisMonth, newUsersLastMonth] = await Promise.all([
            this._userRepository.countByRole(UserRole.USER),
            this._userRepository.countCreatedBetween(UserRole.USER, startOfThisMonth, now),
            this._userRepository.countCreatedBetween(UserRole.USER, startOfLastMonth, startOfThisMonth),
        ]);

        return { totalUsers, newUsersThisMonth, newUsersLastMonth };
    }
}