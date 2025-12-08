import { User } from "../../../domain/entities/User";

export interface IGetUsersUseCase {
    execute(page: number, limit: number, search: string): Promise<{ 
        users: User[]; 
        total: number 
    }>;
}