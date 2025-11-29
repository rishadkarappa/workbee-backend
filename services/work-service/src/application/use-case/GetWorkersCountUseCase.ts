import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerMapper } from "../mappers/WorkerMapper";

@injectable()
export class GetWorkersCountUseCase {
     constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository
    ) {}

    async execute(){
        const countOfWorkers = await this.workerRepository.getWorkersCount()
        return countOfWorkers
    }

}