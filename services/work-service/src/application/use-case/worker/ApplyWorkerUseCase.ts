import { inject, injectable } from "tsyringe";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { ResponseMessage } from "../../../shared/constants/ResponseMessages";
import { IHashService } from "../../../domain/services/IHashService";
import { ApplyWorkerDto, WorkerResponseDto } from "../../dtos/worker/WorkerDTO";
import { WorkerMapper } from "../../mappers/WorkerMapper";
import { IApplyWorkerUseCase } from "../../ports/worker/IApplyWorkerUseCase";

@injectable()
export class ApplyWorkerUseCase implements IApplyWorkerUseCase{
    constructor(
        @inject("WorkerRepository") private _workerRepository: IWorkerRepository,
        @inject("HashService") private _hashService: IHashService
    ) {}

    async execute(dto: ApplyWorkerDto): Promise<WorkerResponseDto> {
        const existing = await this._workerRepository.findByEmail(dto.email);
        if (existing) throw new Error(ResponseMessage.AUTH.ALREADY_EXISTS);

        const worker = WorkerMapper.toEntity(dto);
        worker.password = await this._hashService.hash(worker.password);

        const savedWorker = await this._workerRepository.save(worker);
        return WorkerMapper.toResponseDto(savedWorker);
    }
}