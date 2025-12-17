import { User } from "../../../domain/entities/User";

export interface IGetUsersUseCase {
    execute(page: number, limit: number, search: string, status?: string): Promise<{ users: User[], total: number }>;

}