import { ApplyWorkerDto, WorkerResponseDto } from "../../dtos/worker/WorkerDTO";

export interface IApplyWorkerUseCase {
    execute(dto: ApplyWorkerDto): Promise<WorkerResponseDto>;
}
