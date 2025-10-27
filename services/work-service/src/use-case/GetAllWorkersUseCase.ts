import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../domain/repositories/IWorkerRepository";
import { Worker } from "../domain/entities/Worker";


@injectable()
export class GetAllWorkersUseCase{
    constructor(
        @inject("WorkerRepository") private workerRepository:IWorkerRepository
    ){}

    async execute():Promise<Worker []>{
        const workers = await this.workerRepository.getAllWorkers()
        if(!workers||workers.length==0) throw new Error("did not get approved workers")
        return workers || []
    }
}