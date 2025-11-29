import { Work } from "../entities/Work";

export interface IWorkRepository{
    create(work:Work):Promise<Work>;
    findById(id:string):Promise<Work|null>;
    findByUserId(userId:string):Promise<Work[]>;
    findAll():Promise<Work[]>;
    update(id:string, work:Partial<Work>):Promise<Work|null>;
    delete(id:string):Promise<boolean>;
}
