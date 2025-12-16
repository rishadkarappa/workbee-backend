import { Work } from "../entities/Work";

export interface IWorkRepository{
    create(work:Work):Promise<Work>;
    findById(id:string):Promise<Work|null>;
    findByUserId(userId:string):Promise<Work[]>;
    update(id: string, workData: Partial<Work>): Promise<Work | null>;
    delete(id:string):Promise<boolean>;
    findAll(filters?: {
        search?:string;
        status?:string;
        page?:number;
        limit?:number;
        latitude?:number;
        longitude?: number; 
        maxDistance?: number;
    }): Promise<{ works: Work[]; total: number }>;
    getMyWorks(id:string):Promise<{works:Work[]|null}>;
}
