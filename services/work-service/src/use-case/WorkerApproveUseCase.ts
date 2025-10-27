import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../domain/repositories/IWorkerRepository";
import { Worker } from "../domain/entities/Worker";


@injectable()
export class WorkerApproveUseCase {
    constructor(
        @inject("WorkerRepository") private workerRepository:IWorkerRepository
    ){}

    async execute(email:string):Promise<Worker>{
        const worker = await this.workerRepository.findByEmail(email)
        if(!worker) throw new Error("didnt get worker in usecase leyer")
        worker.isApproved = true
        const updatedWorker = await this.workerRepository.save(worker)
        return updatedWorker
    } 
}