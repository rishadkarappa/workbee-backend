import { Worker } from "../entities/Worker";

export interface IWorkerRepository{
    save(worker:Worker):Promise<Worker>;
    findByEmail(email:string):Promise<Worker|null>;
    findById(id:string):Promise<Worker|null>;
    getNewAppliers(page: number, limit: number, search: string): Promise<{ 
        workers: Worker[]; 
        total: number 
    }>;
    getAllWorkers(page: number, limit: number, search: string, status?: string): Promise<{ workers: Worker[]; total: number }>;

    getWorkersCount():Promise<number>;
    findByIds(ids: string[]): Promise<Worker[]>;

}


