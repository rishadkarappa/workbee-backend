import { NewUser, User } from "../entities/User";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>
    getUsers(page: number, limit: number, search: string, status?: string): Promise<{ users: User[], total: number }>;
    save(user: User | NewUser): Promise<User>;
    findByIds(ids: string[]): Promise<User[]>;
    saveNewPassword(userId: string, newHashedPassword: string): Promise<boolean>;
    updateProfileImage(userId: string, imageUrl: string, publicId: string): Promise<boolean>;
    
    //admin dash
    countByRole(role: string): Promise<number>;
    countCreatedBetween(role: string, start: Date, end: Date): Promise<number>;
};