// import { inject, injectable } from "tsyringe";
// import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
// import { Worker } from "../../domain/entities/Worker";
// import { ResponseMessage } from "../../shared/constants/ResponseMessages";
// import { IHashService } from "../../domain/services/IHashService";


// @injectable()
// export class ApplyWorkerUseCase{
//     constructor (
//         @inject("WorkerRepository") private workerRepository:IWorkerRepository,
//         @inject("HashService") private hashService:IHashService
//     ) {}

//     async execute(worker:Worker):Promise<Worker>{
//         const existing = await this.workerRepository.findByEmail(worker.email)
//         if(existing) throw new Error(ResponseMessage.AUTH.ALREADY_EXISTS)

//         const hashedPassword = await this.hashService.hash(worker.password)

//         const savedWorker = await this.workerRepository.save({...worker,password:hashedPassword})
//         return savedWorker
//     }
// }


import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { ResponseMessage } from "../../shared/constants/ResponseMessages";
import { IHashService } from "../../domain/services/IHashService";
import { ApplyWorkerDto, WorkerResponseDto } from "../dtos/WorkerDTO";
import { WorkerMapper } from "../mappers/WorkerMapper";

@injectable()
export class ApplyWorkerUseCase {
    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository,
        @inject("HashService") private hashService: IHashService
    ) {}

    async execute(dto: ApplyWorkerDto): Promise<WorkerResponseDto> {
        const existing = await this.workerRepository.findByEmail(dto.email);
        if (existing) throw new Error(ResponseMessage.AUTH.ALREADY_EXISTS);

        const worker = WorkerMapper.toEntity(dto);
        worker.password = await this.hashService.hash(worker.password);

        const savedWorker = await this.workerRepository.save(worker);
        return WorkerMapper.toResponseDto(savedWorker);
    }
}