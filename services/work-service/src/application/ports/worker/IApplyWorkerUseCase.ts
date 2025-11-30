import { ApplyWorkerDto, WorkerResponseDto, WorkerApproveDto } from "../../dtos/WorkerDTO";

export interface IApplyWorkerUseCase {
    execute(dto: ApplyWorkerDto): Promise<WorkerResponseDto>;
}
