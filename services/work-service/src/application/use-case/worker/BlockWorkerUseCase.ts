import { inject, injectable } from "tsyringe";
import { IBlockWorkerUseCase } from "../../ports/worker/IBlockWorkerUseCase";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { Worker } from "../../../domain/entities/Worker";

@injectable()
export class BlockWorkerUseCase implements IBlockWorkerUseCase{
    constructor(
        @inject("WorkerRepository") private _workerRepository:IWorkerRepository
    ){}

    async execute(workerId: string): Promise<Worker> {
        const worker = await this._workerRepository.findById(workerId)
        if(!worker) throw new Error("dont get worker to block");
        worker.isBlocked = !worker.isBlocked
        return this._workerRepository.save(worker)
    }
}