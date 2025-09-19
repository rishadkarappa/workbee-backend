import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserModel } from "../models/UserSchema";

export class MongoUserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({email});
        if(!user) return null;
        return {
            id:user.id,
            fullName:user.fullName,
            email:user.email,
            password:user.password,
            createdAt:user.createdAt
        }
    }

    async save(user: User): Promise<User> {
        const newUser = new UserModel(user);
        const saved = await newUser.save();
        return {
            id:saved.id,
            fullName:saved.fullName,
            email:saved.email,
            password:saved.password,
            createdAt:saved.createdAt
        }
    }
}


