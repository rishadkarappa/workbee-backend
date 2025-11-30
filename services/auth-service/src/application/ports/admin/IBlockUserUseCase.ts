import { User } from "../../../domain/entities/User";

export interface IBlockUserUseCase{
    execute(id:string):Promise<User>
}


