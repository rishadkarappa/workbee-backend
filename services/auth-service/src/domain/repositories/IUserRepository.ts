import { User } from "../entities/User";

export interface IUserRepository {
    findByEmail(email:string):Promise<User | null>;
    findById(id:string):Promise<User | null>
    getUsers(page: number, limit: number, search: string, status?: string): Promise<{ users: User[], total: number }>;
    save(user: User): Promise<User>;
    findByIds(ids: string[]): Promise<User[]>;
}


