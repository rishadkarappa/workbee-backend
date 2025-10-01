import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserModel } from "../models/UserSchema";

export class MongoUserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        if (!user) return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        }
    }

    // async save(user: User): Promise<User> {
    //     const newUser = new UserModel(user);
    //     const saved = await newUser.save();
    //     return {
    //         id:saved.id,
    //         name:saved.name,
    //         email:saved.email,
    //         password:saved.password,
    //         isVerified:saved.isVerified,
    //         createdAt:saved.createdAt
    //     }
    // }
    
    async save(user: User): Promise<User> {
        if (user.id) {
            const updated = await UserModel.findByIdAndUpdate(user.id, user, { new: true });
            return {
                id: updated!.id,
                name: updated!.name,
                email: updated!.email,
                password: updated!.password,
                isVerified: updated!.isVerified,
                createdAt: updated!.createdAt,
            };
        } else {
            const newUser = new UserModel(user);
            const saved = await newUser.save();
            return {
                id: saved.id,
                name: saved.name,
                email: saved.email,
                password: saved.password,
                isVerified: saved.isVerified,
                createdAt: saved.createdAt,
            };
        }
    }


    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id)
        if (!user) return null
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
        }
    }
}


