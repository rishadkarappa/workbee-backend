import { injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserModel } from "../models/UserSchema";
import { MongoBaseRepository } from "./MongoBaseRepository";

@injectable()
export class MongoUserRepository extends MongoBaseRepository<User, any> implements IUserRepository {
    constructor() {
        super(UserModel)
    }

    protected map(user: any): User {
        return {
            // id: user.id,
            id: user._id?.toString() || user.id?.toString(),
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked,
            createdAt: user.createdAt
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email })
        return user ? this.map(user) : null
    }


    async getUsers(
        page: number = 1,
        limit: number = 10,
        search: string = ""
    ): Promise<{ users: User[], total: number }> {
        const skip = (page - 1) * limit;

        // Build search query
        const searchQuery = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const [users, total] = await Promise.all([
            UserModel.find(searchQuery)
                .skip(skip)
                .limit(limit)
                .lean(),
            UserModel.countDocuments(searchQuery)
        ]);

        return {
            users: users.map(user => this.map(user)),
            total
        };
    }

    async save(user: User): Promise<User> {
        if (user.id) {
            const updated = await UserModel.findByIdAndUpdate(user.id, user, { new: true })
            return this.map(updated!)
        } else {
            const newUser = new UserModel(user)
            const saved = await newUser.save()
            return this.map(saved)
        }
    }
}