import { User } from "../entities/User";

export interface IUserRepository {
    findByEmail(email:string):Promise<User | null>;
    findById(id:string):Promise<User | null>
    getUsers():Promise<User []>;
    save(user: User): Promise<User>;
}


// import { User } from "../entities/User";

// export interface IUserRepository {
//     findByEmail(email:string):Promise<User | null>;
//     findById(id:string):Promise<User | null>
//     getUsers():Promise<User []>;
//     save(user: User): Promise<User>;
//     saveRefreshToken(userId: string, refreshToken: string): Promise<void>;
//     etRefreshToken(userId: string): Promise<string | null>;
//     deleteRefreshToken(userId: string): Promise<void>;
// }


