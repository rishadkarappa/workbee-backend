import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { Worker } from "../../domain/entities/Worker";
import { WorkerResponseDto } from "../dtos/WorkerDTO";
import { WorkerMapper } from "../mappers/WorkerMapper";


// @injectable()
// export class GetAllWorkersUseCase{
//     constructor(
//         @inject("WorkerRepository") private workerRepository:IWorkerRepository
//     ){}

//     async execute():Promise<Worker []>{
//         const workers = await this.workerRepository.getAllWorkers()
//         if(!workers||workers.length==0) throw new Error("did not get approved workers")
//         return workers || []
//     }
// }

@injectable()
export class GetAllWorkersUseCase {
    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository
    ) {}

    async execute(): Promise<WorkerResponseDto[]> {
        const workers = await this.workerRepository.getAllWorkers();
        if (!workers || workers.length === 0) {
            throw new Error("No approved workers found");
        }
        return WorkerMapper.toResponseDtoList(workers);
    }
}