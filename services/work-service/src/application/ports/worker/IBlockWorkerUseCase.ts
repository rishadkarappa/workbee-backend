import { Worker } from "../../../domain/entities/Worker";

export interface IBlockWorkerUseCase{
    execute(id:string):Promise<Worker>
}