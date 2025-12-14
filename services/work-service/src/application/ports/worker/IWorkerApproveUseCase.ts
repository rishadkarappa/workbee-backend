import { WorkerApproveDto, WorkerResponseDto } from "../../dtos/worker/WorkerDTO";

export interface IWorkerApproveUseCase {
    execute(dto: WorkerApproveDto): Promise<WorkerResponseDto>;
}