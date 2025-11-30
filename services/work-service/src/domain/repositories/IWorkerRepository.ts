import { Worker } from "../entities/Worker";

export interface IWorkerRepository{
    save(worker:Worker):Promise<Worker>;
    findByEmail(email:string):Promise<Worker|null>;
    getNewAppliers():Promise<Worker []>;
    getAllWorkers():Promise<Worker [] >;
    getWorkersCount():Promise<number>;
}



