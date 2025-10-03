import { injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserModel } from "../models/UserSchema";
import { MongoBaseRepository } from "./MongoBaseRepository";

@injectable()
export class MongoUserRepository extends MongoBaseRepository<User, any> implements IUserRepository{
    constructor(){
        super(UserModel)
    }

    protected map(user: any): User {
        return{
            id:user.id,
            name:user.name,
            email:user.email,
            password:user.password,
            isVerified:user.isVerified,
            createdAt:user.createdAt
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({email})
        return user?this.map(user):null
    }

    async save(user: User): Promise<User> {
        if(user.id){
            const updated = await UserModel.findByIdAndUpdate(user.id, user, {new:true})
            return this.map(updated!)
        } else {
            const newUser = new UserModel(user)
            const saved = await newUser.save()
            return this.map(saved)
        }
    }
}