import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../domain/repositories/IWorkerRepository";
import { Worker } from "../domain/entities/Worker";
import { ResponseMessage } from "../shared/constants/ResponseMessages";
import { IHashService } from "../domain/services/IHashService";


@injectable()
export class ApplyWorkerUseCase{
    constructor (
        @inject("WorkerRepository") private workerRepository:IWorkerRepository,
        @inject("HashService") private hashService:IHashService
    ) {}

    async execute(worker:Worker):Promise<Worker>{
        const existing = await this.workerRepository.findByEmail(worker.email)
        if(existing) throw new Error(ResponseMessage.AUTH.ALREADY_EXISTS)

        const hashedPassword = await this.hashService.hash(worker.password)

        const savedWorker = await this.workerRepository.save({...worker,password:hashedPassword})
        return savedWorker
    }
}

